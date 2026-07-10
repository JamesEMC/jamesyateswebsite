(function () {
  "use strict";

  const esc = value => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  const clean = value => String(value || "").replace(/\s+/g, " ").trim();

  function labelFor(control) {
    const explicit = control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`);
    const label = explicit || control.closest("label");
    if (!label) return control.name || control.id || "Input";
    const copy = label.cloneNode(true);
    copy.querySelectorAll("input, select, textarea, small").forEach(el => el.remove());
    return clean(copy.textContent) || control.name || control.id || "Input";
  }

  function unitFor(control) {
    const row = control.closest(".field");
    const unitSelect = row && row.querySelector("select.unit-select");
    return unitSelect && unitSelect !== control ? ` ${unitSelect.options[unitSelect.selectedIndex]?.text || ""}` : "";
  }

  function controlValue(control) {
    if (control.type === "checkbox") return control.checked ? "Yes" : "No";
    if (control.type === "radio") return control.checked ? clean(control.closest("label")?.textContent || control.value) : null;
    if (control.tagName === "SELECT") return clean(control.options[control.selectedIndex]?.text || control.value);
    return `${control.value}${unitFor(control)}`.trim();
  }

  function collectInputs(root) {
    const rows = [];
    const seenRadio = new Set();
    root.querySelectorAll("input, select, textarea").forEach(control => {
      if (control.disabled || control.hidden || control.classList.contains("value-input") || ["button", "submit", "reset", "file", "hidden"].includes(control.type)) return;
      if (control.type === "radio") {
        if (seenRadio.has(control.name)) return;
        seenRadio.add(control.name);
        const checked = root.querySelector(`input[type="radio"][name="${CSS.escape(control.name)}"]:checked`);
        if (!checked) return;
        const groupLabel = (control.name || "Selection").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase());
        rows.push([groupLabel, controlValue(checked)]);
        return;
      }
      const value = controlValue(control);
      if (value !== null && value !== "") rows.push([labelFor(control), value]);
    });
    return rows;
  }

  function collectResults(root) {
    const rows = [];
    const seen = new Set();
    root.querySelectorAll(".result-row").forEach(row => {
      const label = clean(row.querySelector(".rlabel")?.textContent) || "Result";
      const value = clean(row.querySelector(".rvalue")?.textContent);
      const key = `${label}|${value}`;
      if (value && !seen.has(key)) { rows.push([label, value]); seen.add(key); }
    });
    root.querySelectorAll(".metric").forEach(metric => {
      const label = clean(metric.querySelector(".label, span")?.textContent) || "Result";
      const value = [metric.querySelector("strong, .value")?.textContent, metric.querySelector("small")?.textContent]
        .map(clean).filter(Boolean).join(" — ");
      const key = `${label}|${value}`;
      if (value && !seen.has(key)) { rows.push([label, value]); seen.add(key); }
    });
    root.querySelectorAll(".verdict, .kpi").forEach(block => {
      const label = clean(block.querySelector("h3, span")?.textContent) || "Assessment";
      const value = clean(block.querySelector("p, b")?.textContent);
      const key = `${label}|${value}`;
      if (value && !seen.has(key)) { rows.push([label, value]); seen.add(key); }
    });
    root.querySelectorAll(".result:not(.result-row)").forEach(block => {
      const value = clean(block.textContent);
      const key = `Assessment|${value}`;
      if (value && !seen.has(key)) { rows.push(["Assessment", value]); seen.add(key); }
    });
    return rows;
  }

  function cellText(cell) {
    const control = cell.querySelector("input, select, textarea");
    if (control) return `${controlValue(control) || ""}${control.classList.contains("is-source") ? " (entered value)" : ""}`;
    return clean(cell.textContent);
  }

  function collectTables(root, maxRows) {
    return [...root.querySelectorAll("table")].map((table, index) => {
      const headings = table.tHead?.rows.length ? [...table.tHead.rows[0].cells].map(cellText) : [];
      const bodyRows = table.tBodies.length
        ? [...table.tBodies].flatMap(body => [...body.rows])
        : [...table.rows].slice(headings.length ? 1 : 0);
      const rows = bodyRows.slice(0, maxRows).map(row => [...row.cells].map(cellText));
      return rows.length ? { title: table.getAttribute("aria-label") || `Data table ${index + 1}`, headings, rows } : null;
    }).filter(Boolean);
  }

  function inlineSvg(svg) {
    const clone = svg.cloneNode(true);
    const originalNodes = [svg, ...svg.querySelectorAll("*")];
    const cloneNodes = [clone, ...clone.querySelectorAll("*")];
    const props = ["fill", "fillOpacity", "stroke", "strokeWidth", "strokeDasharray", "strokeOpacity", "opacity", "fontFamily", "fontSize", "fontWeight"];
    originalNodes.forEach((node, i) => {
      const cs = getComputedStyle(node);
      props.forEach(prop => {
        const value = cs[prop];
        // "none" is essential SVG styling: dropping it turns open line paths into solid black polygons.
        if (value && value !== "normal") cloneNodes[i].style[prop] = value;
      });
    });
    clone.removeAttribute("id");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.style.width = "100%";
    clone.style.height = "auto";
    clone.style.display = "block";
    return clone.outerHTML;
  }

  function collectVisuals(root, selectors) {
    const nodes = selectors?.length
      ? selectors.flatMap(selector => [...root.querySelectorAll(selector)])
      : [...root.querySelectorAll(".viz svg, .chart-wrap svg, canvas")];
    return [...new Set(nodes)].slice(0, 8).map((node, index) => {
      try {
        const content = node.tagName === "CANVAS"
          ? `<img src="${node.toDataURL("image/png")}" alt="Report plot ${index + 1}">`
          : inlineSvg(node);
        return { title: node.getAttribute("aria-label") || node.querySelector?.("title")?.textContent || `Plot ${index + 1}`, content };
      } catch (error) {
        console.warn("Report visual skipped", error);
        return null;
      }
    }).filter(Boolean);
  }

  function tableHtml(rows, headings = ["Item", "Value"]) {
    if (!rows.length) return "";
    const cols = Math.max(...rows.map(row => row.length), headings.length);
    return `<table><thead><tr>${Array.from({ length: cols }, (_, i) => `<th>${esc(headings[i] || "")}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${Array.from({ length: cols }, (_, i) => `<td>${esc(row[i] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }

  function build(config) {
    const root = config.root ? document.querySelector(config.root) : document.querySelector("main") || document.body;
    const title = config.title || clean(root.querySelector("h1")?.textContent) || document.title;
    const intro = config.summary || clean(root.querySelector(".intro, .lede, .tagline")?.textContent);
    const inputs = collectInputs(root);
    const results = collectResults(root);
    const tables = collectTables(root, config.maxTableRows || 80);
    const visuals = collectVisuals(root, config.visuals);
    const note = config.note || clean(root.querySelector(".note")?.textContent);
    const stamp = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
    const source = location.href.replace(/^file:\/\//, "");

    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — Engineering report</title><style>
      :root{color:#131619;background:#fff;font-family:Arial,Helvetica,sans-serif}*{box-sizing:border-box}body{margin:0}.page{max-width:980px;margin:0 auto;padding:34px 42px 50px}.toolbar{position:sticky;top:0;z-index:2;display:flex;justify-content:flex-end;gap:10px;padding:10px 16px;background:#eef2f3;border-bottom:1px solid #c3ccd0}.toolbar button{border:1px solid #131619;background:#fff;color:#131619;padding:9px 14px;font-weight:700;cursor:pointer}.brand{font:700 12px monospace;letter-spacing:.12em;text-transform:uppercase;color:#0d6e79}.meta{color:#64707a;font-size:12px;margin:5px 0 22px}h1{font-size:25px;line-height:1.15;margin:5px 0 6px}h2{font-size:16px;margin:25px 0 9px;border-bottom:2px solid #0d6e79;padding-bottom:5px}p{line-height:1.5;color:#36444c}table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:12px;page-break-inside:auto}th{text-align:left;text-transform:uppercase;letter-spacing:.06em;color:#52636c;background:#eef3f4}th,td{border:1px solid #cbd4d7;padding:7px 8px;vertical-align:top}td{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.plot{border:1px solid #c3ccd0;padding:10px;margin:10px 0 18px;break-inside:avoid;background:#fff}.plot h3{font-size:12px;color:#64707a;margin:0 0 8px}.plot img,.plot svg{display:block;width:100%;height:auto;max-height:560px;object-fit:contain}.note{border-left:3px solid #b3541e;background:#f5f7f7;padding:12px 15px;margin-top:24px}.foot{font-size:10px;color:#64707a;border-top:1px solid #c3ccd0;margin-top:28px;padding-top:10px;overflow-wrap:anywhere}@media print{.toolbar{display:none}.page{max-width:none;padding:14mm 12mm}@page{size:A4;margin:8mm}h2{break-after:avoid}tr,.plot{break-inside:avoid}}
    </style></head><body><div class="toolbar"><button onclick="window.print()">Print / Save PDF</button><button onclick="window.close()">Close</button></div><article class="page"><div class="brand">James Yates · jamesyates.co.uk</div><h1>${esc(title)}</h1><div class="meta">Generated ${esc(stamp)}</div>${intro ? `<p>${esc(intro)}</p>` : ""}${inputs.length ? `<h2>Entered parameters</h2>${tableHtml(inputs)}` : ""}${results.length ? `<h2>Calculated results</h2>${tableHtml(results)}` : ""}${tables.map(table => `<h2>${esc(table.title)}</h2>${tableHtml(table.rows, table.headings)}`).join("")}${visuals.length ? `<h2>Plots and diagrams</h2>${visuals.map(v => `<div class="plot"><h3>${esc(v.title)}</h3>${v.content}</div>`).join("")}` : ""}${note ? `<div class="note">${esc(note)}</div>` : ""}<div class="foot">Planning and educational output only. Verify assumptions, inputs and the applicable standard before formal use.<br>Source: ${esc(source)}</div></article></body></html>`;
  }

  function attach(config = {}) {
    const existingButton = config.button ? document.querySelector(config.button) : null;
    const target = document.querySelector(config.target || ".tool-layout, .layout, main");
    if (!existingButton && (!target || target.parentElement?.querySelector(":scope > .report-actions"))) return;
    let wrap = existingButton?.closest(".report-actions") || existingButton?.parentElement;
    let button = existingButton;
    if (!button) {
      wrap = document.createElement("div");
      wrap.className = "report-actions";
      wrap.innerHTML = `<span class="report-status">Creates a populated, print-ready engineering summary.</span><button class="btn" type="button">Export report</button>`;
      target.insertAdjacentElement(target.tagName === "MAIN" ? "beforeend" : "afterend", wrap);
      button = wrap.querySelector("button");
    }
    button.addEventListener("click", () => {
      const reportWindow = window.open("", "_blank");
      if (!reportWindow) {
        const status = wrap?.querySelector(".report-status, small");
        if (status) status.textContent = "Pop-up blocked — allow pop-ups, then try again.";
        return;
      }
      if (config.requireValues && ![...document.querySelectorAll(config.requireValues)].some(el => String(el.value || "").trim())) {
        reportWindow.close();
        const status = wrap?.querySelector(".report-status, small");
        if (status) status.textContent = "Enter a value before exporting the report.";
        return;
      }
      const html = build(config);
      reportWindow.document.open();
      reportWindow.document.write(html);
      reportWindow.document.close();
      reportWindow.focus();
    });
  }

  window.ReportTools = { attach, build };
}());
