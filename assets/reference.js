(() => {
  "use strict";

  const deck = Array.isArray(window.REFERENCE_DECK) ? window.REFERENCE_DECK : [];
  const byId = new Map(deck.map(card => [card.id, card]));
  const storageKey = "jy-test-study-deck-v1";
  const day = 24 * 60 * 60 * 1000;
  const categories = [...new Set(deck.map(card => card.category))];

  const el = id => document.getElementById(id);
  const ui = {
    due: el("dueCount"), mastered: el("masteredCount"), accuracy: el("accuracyValue"), reviews: el("reviewCount"),
    mode: el("modeSelect"), category: el("categorySelect"), start: el("startSession"),
    position: el("sessionPosition"), remaining: el("sessionRemaining"), bar: el("sessionBar"),
    categoryProgress: el("categoryProgressList"), card: el("studyCard"), cardCategory: el("cardCategory"),
    cardLevel: el("cardLevel"), kicker: el("cardKicker"), question: el("cardQuestion"),
    answerPanel: el("answerPanel"), answer: el("cardAnswer"), detail: el("cardDetail"),
    moreInfo: el("moreInfo"), source: el("cardSource"), reveal: el("revealAnswer"), ratings: el("ratingActions"),
    export: el("exportProgress"), import: el("importProgress"), reset: el("resetProgress"), file: el("progressFile"),
    saveState: el("saveState")
  };

  let state = loadState();
  let queue = [];
  let current = null;
  let session = null;
  let saveTimer = null;

  function blankState() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalReviews: 0,
      totalCorrect: 0,
      sessions: 0,
      progress: {}
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey));
      return normaliseState(parsed);
    } catch (error) {
      return blankState();
    }
  }

  function normaliseState(input) {
    const fresh = blankState();
    if (!input || typeof input !== "object") return fresh;
    fresh.createdAt = typeof input.createdAt === "string" ? input.createdAt : fresh.createdAt;
    fresh.updatedAt = typeof input.updatedAt === "string" ? input.updatedAt : fresh.updatedAt;
    fresh.totalReviews = finiteNonNegative(input.totalReviews);
    fresh.totalCorrect = finiteNonNegative(input.totalCorrect);
    fresh.sessions = finiteNonNegative(input.sessions);
    if (input.progress && typeof input.progress === "object") {
      for (const [id, value] of Object.entries(input.progress)) {
        if (!byId.has(id) || !value || typeof value !== "object") continue;
        fresh.progress[id] = {
          reviews: finiteNonNegative(value.reviews),
          correct: finiteNonNegative(value.correct),
          lapses: finiteNonNegative(value.lapses),
          streak: finiteNonNegative(value.streak),
          recovery: finiteNonNegative(value.recovery),
          interval: finiteNonNegative(value.interval),
          due: Number.isFinite(Number(value.due)) ? Number(value.due) : 0,
          lastRating: ["wrong", "nearly", "correct", "easy"].includes(value.lastRating) ? value.lastRating : null,
          lastReviewed: Number.isFinite(Number(value.lastReviewed)) ? Number(value.lastReviewed) : 0
        };
      }
    }
    return fresh;
  }

  function finiteNonNegative(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
  }

  function progressFor(id) {
    if (!state.progress[id]) {
      state.progress[id] = { reviews: 0, correct: 0, lapses: 0, streak: 0, recovery: 0, interval: 0, due: 0, lastRating: null, lastReviewed: 0 };
    }
    return state.progress[id];
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      ui.saveState.textContent = "Saved in this browser";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { ui.saveState.textContent = "Progress stays in this browser"; }, 1800);
    } catch (error) {
      ui.saveState.textContent = "Progress could not be saved";
    }
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weakness(card) {
    const p = state.progress[card.id];
    if (!p || p.reviews === 0) return 65 + Math.random() * 12;
    const recall = p.correct / Math.max(1, p.reviews);
    const overdue = Math.max(0, Date.now() - p.due) / day;
    return (p.recovery * 35) + (p.lapses * 8) + ((1 - recall) * 30) + Math.min(20, overdue) - Math.min(20, p.interval / 2) + Math.random() * 5;
  }

  function isDue(card) {
    const p = state.progress[card.id];
    return !p || p.reviews === 0 || p.due <= Date.now();
  }

  function makeQueue() {
    const mode = ui.mode.value;
    const selectedCategory = ui.category.value;
    let cards = [...deck];

    if (mode === "people") {
      cards = cards.filter(card => card.category === "People & roles");
      cards.sort((a, b) => weakness(b) - weakness(a));
    } else if (mode === "category") {
      cards = cards.filter(card => card.category === selectedCategory);
      cards.sort((a, b) => weakness(b) - weakness(a));
    } else if (mode === "due") {
      cards = cards.filter(isDue).sort((a, b) => weakness(b) - weakness(a)).slice(0, 30);
    } else if (mode === "weak") {
      cards.sort((a, b) => weakness(b) - weakness(a));
      cards = cards.slice(0, 15);
    } else if (mode === "full") {
      cards = shuffle(cards);
    } else {
      const due = cards.filter(isDue).sort((a, b) => weakness(b) - weakness(a));
      const later = cards.filter(card => !isDue(card)).sort((a, b) => weakness(b) - weakness(a));
      cards = [...due, ...later].slice(0, 10);
    }

    return cards.map(card => card.id);
  }

  function startSession() {
    queue = makeQueue();
    session = {
      mode: ui.mode.value,
      startedWith: queue.length,
      reviews: 0,
      wrong: 0,
      nearly: 0,
      correct: 0,
      easy: 0
    };
    state.sessions += 1;
    saveState();
    if (!queue.length) {
      renderComplete("Nothing is due", "Choose another session or category to keep studying.");
      return;
    }
    current = byId.get(queue[0]);
    renderCard();
  }

  function renderCard() {
    if (!current) return;
    ui.card.classList.remove("is-complete");
    ui.cardCategory.hidden = false;
    ui.cardLevel.hidden = false;
    ui.kicker.hidden = false;
    ui.cardCategory.textContent = current.category;
    ui.cardLevel.textContent = current.level;
    const p = state.progress[current.id];
    ui.kicker.textContent = p && p.reviews ? `Seen ${p.reviews} ${p.reviews === 1 ? "time" : "times"} · interval ${p.interval || 0} days` : "New card";
    ui.question.textContent = current.question;
    ui.answer.textContent = current.answer;
    ui.detail.textContent = current.detail;
    ui.moreInfo.open = false;
    renderSource(current);
    ui.answerPanel.hidden = true;
    ui.reveal.hidden = false;
    ui.ratings.hidden = true;
    updateSessionProgress();
    ui.reveal.focus({ preventScroll: true });
  }

  function renderSource(card) {
    ui.source.replaceChildren();
    const prefix = document.createElement("span");
    prefix.textContent = "Source · ";
    ui.source.append(prefix);
    if (card.sourceUrl) {
      const link = document.createElement("a");
      link.href = card.sourceUrl;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = card.source;
      ui.source.append(link);
    } else {
      ui.source.append(document.createTextNode(card.source));
    }
  }

  function revealAnswer() {
    if (!current || !ui.answerPanel.hidden) return;
    ui.answerPanel.hidden = false;
    ui.reveal.hidden = true;
    ui.ratings.hidden = false;
    ui.ratings.querySelector("button").focus({ preventScroll: true });
  }

  function rate(rating) {
    if (!current || ui.answerPanel.hidden) return;
    const p = progressFor(current.id);
    const now = Date.now();
    p.reviews += 1;
    p.lastRating = rating;
    p.lastReviewed = now;
    state.totalReviews += 1;
    session.reviews += 1;
    session[rating] += 1;

    let requeueDelay = null;
    if (rating === "wrong") {
      p.lapses += 1;
      p.streak = 0;
      p.recovery = Math.max(2, p.recovery);
      p.interval = 0;
      p.due = now;
      requeueDelay = 3;
    } else if (rating === "nearly") {
      p.streak = 0;
      p.recovery = Math.max(1, p.recovery);
      p.interval = 0;
      p.due = now;
      requeueDelay = 5;
    } else if (rating === "correct") {
      p.correct += 1;
      state.totalCorrect += 1;
      if (p.recovery > 0) {
        p.recovery -= 1;
        if (p.recovery > 0) {
          p.due = now;
          requeueDelay = 5;
        } else {
          p.streak = 1;
          p.interval = 1;
          p.due = now + day;
        }
      } else {
        p.streak += 1;
        p.interval = nextInterval(p.interval, p.streak);
        p.due = now + p.interval * day;
      }
    } else if (rating === "easy") {
      p.correct += 1;
      state.totalCorrect += 1;
      p.recovery = 0;
      p.streak += 2;
      p.interval = Math.max(7, nextInterval(p.interval, p.streak) * 2);
      p.due = now + p.interval * day;
    }

    queue.shift();
    if (requeueDelay !== null) {
      const insertAt = Math.min(queue.length, Math.max(1, requeueDelay));
      queue.splice(insertAt, 0, current.id);
    }

    saveState();
    updateDashboard();
    if (!queue.length) {
      current = null;
      renderComplete("Session complete", sessionSummary());
      return;
    }
    current = byId.get(queue[0]);
    renderCard();
  }

  function nextInterval(previous, streak) {
    if (previous <= 0) return 1;
    if (previous === 1) return 3;
    if (previous <= 3) return 7;
    if (previous <= 7) return 14;
    if (previous <= 14) return 30;
    if (previous <= 30) return 60;
    return Math.min(180, Math.round(previous * 1.7 + Math.max(0, streak - 5)));
  }

  function sessionSummary() {
    const secure = session.correct + session.easy;
    return `${session.reviews} reviews · ${secure} secure · ${session.nearly} nearly · ${session.wrong} wrong. Weak cards have been rescheduled.`;
  }

  function renderComplete(title, message) {
    ui.card.classList.add("is-complete");
    ui.cardCategory.hidden = true;
    ui.cardLevel.hidden = true;
    ui.kicker.hidden = false;
    ui.kicker.textContent = "Study session";
    ui.question.textContent = title;
    ui.answerPanel.hidden = false;
    ui.answer.textContent = message;
    ui.detail.textContent = "Use a focused category when you want depth, or choose Weak areas to concentrate on cards with lapses and low recall.";
    ui.moreInfo.open = false;
    ui.source.replaceChildren();
    ui.reveal.hidden = true;
    ui.ratings.hidden = true;
    const actions = ui.card.querySelector(".card-actions");
    let again = actions.querySelector(".complete-again");
    if (!again) {
      again = document.createElement("button");
      again.type = "button";
      again.className = "primary-action complete-again";
      again.textContent = "Start another session";
      again.addEventListener("click", startSession);
      actions.append(again);
    }
    again.hidden = false;
    updateSessionProgress(true);
    again.focus({ preventScroll: true });
  }

  function updateSessionProgress(complete = false) {
    const again = ui.card.querySelector(".complete-again");
    if (again && !complete) again.hidden = true;
    if (!session) {
      ui.position.textContent = "Ready";
      ui.remaining.textContent = "—";
      ui.bar.style.width = "0%";
      return;
    }
    const remaining = complete ? 0 : queue.length;
    const denominator = Math.max(1, session.reviews + remaining);
    const percent = complete ? 100 : Math.round((session.reviews / denominator) * 100);
    ui.position.textContent = complete ? "Complete" : `Card ${session.reviews + 1}`;
    ui.remaining.textContent = `${remaining} remaining`;
    ui.bar.style.width = `${percent}%`;
  }

  function updateDashboard() {
    const now = Date.now();
    let due = 0;
    let mastered = 0;
    for (const card of deck) {
      const p = state.progress[card.id];
      if (!p || p.reviews === 0 || p.due <= now) due += 1;
      if (p && p.interval >= 14 && p.recovery === 0) mastered += 1;
    }
    ui.due.textContent = String(due);
    ui.mastered.textContent = String(mastered);
    ui.reviews.textContent = String(state.totalReviews);
    ui.accuracy.textContent = state.totalReviews ? `${Math.round((state.totalCorrect / state.totalReviews) * 100)}%` : "—";
    renderCategoryProgress();
  }

  function renderCategoryProgress() {
    ui.categoryProgress.replaceChildren();
    for (const category of categories) {
      const cards = deck.filter(card => card.category === category);
      let score = 0;
      for (const card of cards) {
        const p = state.progress[card.id];
        if (!p || !p.reviews) continue;
        const recall = p.correct / Math.max(1, p.reviews);
        const spacing = Math.min(1, p.interval / 30);
        const recoveryPenalty = p.recovery ? 0.35 : 1;
        score += ((recall * .55) + (spacing * .45)) * recoveryPenalty;
      }
      const percent = Math.round((score / cards.length) * 100);
      const row = document.createElement("div");
      row.className = "category-row";
      const copy = document.createElement("div");
      copy.className = "category-copy";
      const name = document.createElement("span");
      const value = document.createElement("span");
      name.textContent = category;
      value.textContent = `${percent}%`;
      copy.append(name, value);
      const track = document.createElement("div");
      track.className = "category-track";
      const fill = document.createElement("span");
      fill.style.width = `${percent}%`;
      track.append(fill);
      row.append(copy, track);
      ui.categoryProgress.append(row);
    }
  }

  function populateCategories() {
    ui.category.replaceChildren();
    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = `${category} · ${deck.filter(card => card.category === category).length}`;
      ui.category.append(option);
    }
    ui.category.value = categories[0] || "";
    syncCategoryControl();
  }

  function syncCategoryControl() {
    const focused = ui.mode.value === "category";
    ui.category.disabled = !focused;
    ui.category.closest(".control-block").classList.toggle("is-disabled", !focused);
  }

  function exportProgress() {
    const payload = {
      type: "test-engineering-study-progress",
      exportedAt: new Date().toISOString(),
      cardCount: deck.length,
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `study-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function importProgress(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed && parsed.state ? parsed.state : parsed;
      state = normaliseState(imported);
      saveState();
      updateDashboard();
      startSession();
      ui.saveState.textContent = "Progress imported";
    } catch (error) {
      window.alert("That file is not a valid study-progress backup.");
    } finally {
      ui.file.value = "";
    }
  }

  function resetProgress() {
    if (!window.confirm("Reset every card and remove all saved study progress from this browser?")) return;
    state = blankState();
    localStorage.removeItem(storageKey);
    updateDashboard();
    startSession();
    ui.saveState.textContent = "Progress reset";
  }

  ui.start.addEventListener("click", startSession);
  ui.reveal.addEventListener("click", revealAnswer);
  ui.mode.addEventListener("change", syncCategoryControl);
  ui.ratings.addEventListener("click", event => {
    const button = event.target.closest("button[data-rating]");
    if (button) rate(button.dataset.rating);
  });
  ui.export.addEventListener("click", exportProgress);
  ui.import.addEventListener("click", () => ui.file.click());
  ui.file.addEventListener("change", () => importProgress(ui.file.files[0]));
  ui.reset.addEventListener("click", resetProgress);

  document.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const interactive = event.target.closest("input, select, summary, button, a");
    if (interactive && event.target !== document.body) return;
    if ((event.key === " " || event.code === "Space") && current && ui.answerPanel.hidden) {
      event.preventDefault();
      revealAnswer();
      return;
    }
    if (current && !ui.answerPanel.hidden && ["1", "2", "3", "4"].includes(event.key)) {
      const ratings = ["wrong", "nearly", "correct", "easy"];
      rate(ratings[Number(event.key) - 1]);
    }
  });

  populateCategories();
  updateDashboard();
  startSession();
})();
