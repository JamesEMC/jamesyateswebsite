/* ============================================================
   report.js — universal "Export report" for jamesyates.co.uk tools.
   Injects a button, scrapes the page's inputs (.field), results
   (.result-row, .verdict, .flagline, table.data) and charts
   (SVG/canvas inside .viz, .chart-wrap, .stage, .ppi-wrap),
   then opens a watermarked, print-ready report.
   Pages with a bespoke exporter (#exportBtn) are skipped.
   ============================================================ */
(function () {
  "use strict";
  if (document.getElementById("exportBtn")) return;

  function esc(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function clean(t) { return String(t).replace(/\s+/g, " ").trim(); }

  function collectInputs() {
    const rows = [];
    document.querySelectorAll(".field").forEach(f => {
      const lab = f.querySelector("label");
      if (!lab) return;
      const els = [...f.querySelectorAll("input, select")].filter(el => el.type !== "hidden" && el.offsetParent !== null);
      if (!els.length) return;
      const vals = els.map(el => {
        if (el.tagName === "SELECT") return el.selectedOptions[0] ? clean(el.selectedOptions[0].textContent) : el.value;
        if (el.type === "checkbox") return el.checked ? "yes" : "no";
        if (el.type === "file") return el.files && el.files[0] ? el.files[0].name : "";
        return el.value;
      }).filter(v => v !== "");
      if (vals.length) rows.push([clean(lab.textContent), vals.join("  ")]);
    });
    return rows;
  }

  function collectResults() {
    const rows = [];
    document.querySelectorAll(".result-row").forEach(r => {
      const l = r.querySelector(".rlabel"), v = r.querySelector(".rvalue");
      if (l && v && clean(v.textContent) !== "—") rows.push([clean(l.textContent), clean(v.textContent)]);
    });
    return rows;
  }

  function collectExtras() {
    let html = "";
    document.querySelectorAll(".verdict").forEach(v => { html += `<div class="xtra">${v.innerHTML}</div>`; });
    document.querySelectorAll(".flagline").forEach(v => {
      const t = clean(v.textContent);
      if (t) html += `<p class="flag">${esc(t)}</p>`;
    });
    document.querySelectorAll("table.data").forEach(t => { html += `<div class="xtable">${t.outerHTML}</div>`; });
    return html;
  }

  function collectCharts() {
    let html = "";
    const seen = new Set();
    document.querySelectorAll(".viz, .chart-wrap, .stage, .ppi-wrap, .diag, .geo, .spec, .timing").forEach(box => {
      box.querySelectorAll("svg").forEach(svg => {
        if (seen.has(svg)) return; seen.add(svg);
        if (svg.clientWidth < 40) return;
        html += `<div class="chartbox">${svg.outerHTML}</div>`;
      });
      box.querySelectorAll("canvas").forEach(cv => {
        if (seen.has(cv)) return; seen.add(cv);
        try { html += `<div class="chartbox"><img style="width:100%;display:block" src="${cv.toDataURL("image/png")}"></div>`; } catch (e) {}
      });
    });
    return html;
  }

  function pageStyles() {
    return [...document.querySelectorAll("style")].map(s => s.textContent).join("\n");
  }

  const TOKENS = `:root{--paper:#f4f6f6;--panel:#ffffff;--bg:#f4f6f6;--bg-2:#eceff0;--bg2:#eceff0;--panel-solid:#ffffff;
--ink:#131619;--text:#131619;--ink-soft:#3a4147;--muted:#64707a;--faint:#8b96a0;--line:#dde3e5;--line-strong:#c3ccd0;
--accent:#0d6e79;--accent-ink:#09525b;--accent-bright:#0d6e79;--cyan:#0d6e79;--blue:#09525b;--amber:#b3541e;--warn:#b3541e;
--copper:#0d6e79;--copper-deep:#09525b;--screen:#0f1416;--screen-line:rgba(120,200,215,.14);--trace:#35c6d8;
--trace-soft:rgba(53,198,216,.5);--cream:#f4f6f6;--cream-2:#e9eeee;--dark:#0f1416;--on-dark:#eef3f3;--on-dark-muted:#9fadb2;
--radius:2px;--shadow:none;--serif:Georgia,serif;--sans:system-ui,sans-serif;--mono:ui-monospace,Menlo,monospace;
--font-display:Georgia,serif;--font-body:system-ui,sans-serif;--font-mono:ui-monospace,Menlo,monospace;--measure:68ch}`;

  function exportReport() {
    const title = clean((document.querySelector("main h1") || document.querySelector("h1") || {}).textContent || "Tool report");
    const now = new Date();
    const stamp = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
                  " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const wm = "data:image/svg+xml," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300"><text x="210" y="150" text-anchor="middle" transform="rotate(-30 210 150)" font-family="monospace" font-size="26" fill="rgba(19,22,25,0.06)">jamesyates.co.uk</text></svg>');

    const inputs = collectInputs();
    const results = collectResults();
    const rowsHtml = rows => rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("");

    const w = window.open("", "_blank");
    if (!w) { alert("Pop-up blocked — allow pop-ups for this site to export a report."); return; }
    w.document.write(`<!doctype html><html><head><title>${esc(title)} — jamesyates.co.uk</title>
<style>
${TOKENS}
body { font-family: "Segoe UI", system-ui, sans-serif; color: #131619; margin: 34px 40px;
       background-image: url("${wm}"); print-color-adjust: exact; -webkit-print-color-adjust: exact; }
h1 { font-size: 20px; margin: 0 0 2px; }
.meta { color: #64707a; font-size: 12px; margin-bottom: 18px; }
.brand { float: right; font: 600 13px monospace; color: #0d6e79; }
h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #09525b; margin: 20px 0 6px; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th { text-align: left; color: #64707a; font-size: 11px; text-transform: uppercase; letter-spacing: .06em;
     border-bottom: 1px solid #c3ccd0; padding: 6px 8px; }
td { border-bottom: 1px solid #dde3e5; padding: 6px 8px; font-family: ui-monospace, Menlo, monospace; }
.chartbox { background: #0f1416; padding: 10px; border-radius: 3px; margin: 12px 0; }
.chartbox svg { width: 100%; height: auto; display: block; }
.xtra { border: 1px solid #c3ccd0; padding: 12px 16px; margin: 10px 0; font-size: 13px; }
.xtra h3 { display: flex; justify-content: space-between; font-size: 14px; margin: 0 0 4px; }
.xtra .flag { font: 600 10px monospace; letter-spacing: .1em; padding: 3px 8px; }
.xtra .flag.ok { background: #dcecec; color: #09525b; } .xtra .flag.bad { background: #f3ded9; color: #9c2b1e; }
.xtra p { margin: 4px 0 0; color: #64707a; }
p.flag { font: 600 12px monospace; margin: 6px 0; }
.xtable { margin: 10px 0; }
.foot { margin-top: 22px; padding-top: 10px; border-top: 1px solid #c3ccd0; color: #64707a; font-size: 10.5px; }
${pageStyles()}
</style></head><body>
<span class="brand">jamesyates.co.uk</span>
<h1>${esc(title)}</h1>
<div class="meta">Generated ${stamp} · jamesyates.co.uk</div>
${inputs.length ? `<h2>Inputs</h2><table><tr><th>Input</th><th>Value</th></tr>${rowsHtml(inputs)}</table>` : ""}
${results.length ? `<h2>Results</h2><table><tr><th>Result</th><th>Value</th></tr>${rowsHtml(results)}</table>` : ""}
${collectExtras()}
${collectCharts()}
<div class="foot">Report generated by the interactive tools at jamesyates.co.uk. Provided as-is for education and planning —
verify against the applicable standard and your own engineering judgement before formal use. © James Yates</div>
<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };<\/script>
</body></html>`);
    w.document.close();
  }

  /* ---- inject the button ---- */
  function makeButton() {
    const b = document.createElement("button");
    b.type = "button";
    b.id = "jyReportBtn";
    b.textContent = "Export report";
    b.addEventListener("click", exportReport);
    return b;
  }
  const panel = document.querySelector(".tool-layout .panel") || document.querySelector("main .panel");
  const btn = makeButton();
  if (panel) {
    btn.className = "btn";
    btn.style.cssText = "width:100%;margin-top:18px";
    panel.appendChild(btn);
    const hint = document.createElement("small");
    hint.textContent = "Opens a print-ready report — save as PDF from the print dialog.";
    hint.style.cssText = "display:block;margin-top:8px;color:var(--faint,#8b96a0);font-size:.76rem";
    panel.appendChild(hint);
  } else {
    btn.style.cssText = "position:fixed;right:22px;bottom:22px;z-index:70;padding:12px 18px;" +
      "border:1px solid #131619;background:#f4f6f6;color:#131619;font:600 12px ui-monospace,monospace;" +
      "letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 6px 20px rgba(19,22,25,.15)";
    document.body.appendChild(btn);
  }
})();
