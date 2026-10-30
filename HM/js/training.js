// js/training.js - Interactive HM Scenarios, Self-Assessment Quiz & Glossary

import { store } from './store.js';
import { TRAINING_SCENARIOS, ASSESSMENT_QUIZ, GLOSSARY_TERMS } from './data.js';

let activeTrainingTab = "scenarios"; // 'scenarios', 'quiz', 'glossary'
let currentQuizAnswers = {};

export function initTraining() {
  renderScenarios();
  renderQuiz();
  renderGlossary();
  setupTrainingEventListeners();

  store.on("stateChanged", () => {
    renderScenarios();
    updateScenarioBadges();
  });

  store.on("scenarioCompleted", (scenario) => {
    window.app.playSound("fanfare");
    window.app.showToast("success", "HM Scenario Completed!", `Congratulations! You mastered: "${scenario.title}"!`);
    renderScenarios();
  });
}

// --- Scenarios Rendering ---
export function renderScenarios() {
  const container = document.getElementById("training-scenarios-grid");
  if (!container) return;

  container.innerHTML = TRAINING_SCENARIOS.map(scn => {
    const isCompleted = store.state.scenarioProgress[scn.id];
    return `
      <div class="scenario-card ${isCompleted ? 'completed' : ''}" id="card-${scn.id}">
        <div class="scenario-top">
          <span class="badge ${isCompleted ? 'badge-clean' : 'badge-reserved'}">${scn.badge}</span>
          <span class="scenario-status-pill ${isCompleted ? 'status-completed' : 'status-pending'}">
            ${isCompleted ? '<i class="fa-solid fa-circle-check"></i> Completed' : '<i class="fa-solid fa-clock"></i> Pending Action'}
          </span>
        </div>

        <div class="scenario-title">${escapeHtml(scn.title)}</div>
        <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.35;">${escapeHtml(scn.summary)}</p>

        <div class="scenario-context-box">
          <strong><i class="fa-solid fa-graduation-cap"></i> Pedagogical Context:</strong><br>
          ${escapeHtml(scn.context)}
        </div>

        <div>
          <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.5px;">Step-by-Step Task Checklist:</strong>
          <div class="scenario-steps-list">
            ${scn.steps.map(s => `
              <div class="scenario-step-item">
                <div class="step-num-bubble">${s.step}</div>
                <div>${escapeHtml(s.description)}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="scenario-footer">
          <span style="font-size: 0.74rem; color: var(--color-text-light);">
            <i class="fa-solid fa-stopwatch"></i> ~${scn.estimatedMinutes} mins &bull; ${scn.difficulty}
          </span>
          <button class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'} btn-verify-scenario" data-scn-id="${scn.id}">
            ${isCompleted ? '<i class="fa-solid fa-circle-check"></i> Verified Complete' : '<i class="fa-solid fa-wand-magic-sparkles"></i> Verify My Progress'}
          </button>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".btn-verify-scenario").forEach(btn => {
    btn.addEventListener("click", () => {
      const scnId = btn.dataset.scnId;
      const scn = TRAINING_SCENARIOS.find(s => s.id === scnId);
      if (!scn) return;

      const passed = scn.checkSuccess(store.state);
      if (passed) {
        store.state.scenarioProgress[scn.id] = true;
        store.save();
        window.app.playSound("fanfare");
        window.app.showToast("success", "Scenario Completed!", `Outstanding! You successfully completed "${scn.title}".`);
        renderScenarios();
      } else {
        window.app.playSound("pop");
        window.app.showToast("info", "Scenario Incomplete", "Not all required steps have been achieved yet. Follow the checklist and try again.");
      }
    });
  });
}

function updateScenarioBadges() {
  const completedCount = Object.values(store.state.scenarioProgress).filter(Boolean).length;
  const badgeEl = document.getElementById("nav-badge-training");
  if (badgeEl) {
    badgeEl.textContent = `${completedCount}/${TRAINING_SCENARIOS.length}`;
  }
}

// --- Assessment Quiz Rendering ---
export function renderQuiz() {
  const container = document.getElementById("quiz-questions-container");
  const scoreBanner = document.getElementById("quiz-score-display");
  if (!container) return;

  const savedScore = store.state.quizScore;
  if (savedScore && scoreBanner) {
    scoreBanner.innerHTML = `
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-accent-light);">Previous Score</div>
      <div class="quiz-score-num">${savedScore.score} / ${savedScore.total} (${savedScore.percent}%)</div>
    `;
  }

  container.innerHTML = ASSESSMENT_QUIZ.map((q, idx) => {
    const selectedAns = currentQuizAnswers[q.id];
    const isSubmitted = !!savedScore;
    const isCorrect = isSubmitted && (selectedAns === q.correctIndex);

    return `
      <div class="quiz-question-card" id="qcard-${q.id}">
        <div class="question-text">
          <span class="question-index-tag">Question ${idx + 1}</span>
          <div>${escapeHtml(q.question)}</div>
        </div>

        <div class="quiz-options-group">
          ${q.options.map((opt, optIdx) => {
            let stateClass = "";
            if (isSubmitted) {
              if (optIdx === q.correctIndex) stateClass = "is-correct";
              else if (selectedAns === optIdx && !isCorrect) stateClass = "is-wrong";
            } else if (selectedAns === optIdx) {
              stateClass = "selected";
            }

            return `
              <label class="quiz-option-label ${stateClass}">
                <input type="radio" name="quiz_${q.id}" value="${optIdx}" ${selectedAns === optIdx ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} />
                <span>${escapeHtml(opt)}</span>
              </label>
            `;
          }).join("")}
        </div>

        ${isSubmitted ? `
          <div class="explanation-card">
            <div class="explanation-title">
              <i class="fa-solid fa-lightbulb text-accent"></i>
              ${isCorrect ? '<span style="color: #059669;">Correct Answer</span>' : '<span style="color: #DC2626;">Incorrect Answer</span>'} &bull; Pedagogical Explanation:
            </div>
            <div>${escapeHtml(q.explanation)}</div>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");

  // Attach radio change listeners
  container.querySelectorAll("input[type='radio']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      const qId = e.target.name.replace("quiz_", "");
      currentQuizAnswers[qId] = parseInt(e.target.value, 10);
      renderQuiz();
    });
  });
}

export function submitQuiz() {
  const answeredCount = Object.keys(currentQuizAnswers).length;
  if (answeredCount < ASSESSMENT_QUIZ.length) {
    if (!confirm(`You have only answered ${answeredCount} of ${ASSESSMENT_QUIZ.length} questions. Submit anyway?`)) {
      return;
    }
  }

  const result = store.submitQuiz(currentQuizAnswers);
  window.app.playSound(result.percent >= 70 ? "fanfare" : "pop");
  window.app.showToast("success", "Quiz Graded", `Your Score: ${result.score}/${result.total} (${result.percent}%). Review detailed feedback below.`);
  renderQuiz();

  const btnSubmit = document.getElementById("btn-submit-quiz");
  const btnRetake = document.getElementById("btn-retake-quiz");
  if (btnSubmit) btnSubmit.style.display = "none";
  if (btnRetake) btnRetake.style.display = "inline-flex";
}

export function retakeQuiz() {
  currentQuizAnswers = {};
  store.state.quizScore = null;
  store.save();

  const scoreBanner = document.getElementById("quiz-score-display");
  if (scoreBanner) scoreBanner.innerHTML = "";

  const btnSubmit = document.getElementById("btn-submit-quiz");
  const btnRetake = document.getElementById("btn-retake-quiz");
  if (btnSubmit) btnSubmit.style.display = "inline-flex";
  if (btnRetake) btnRetake.style.display = "none";

  renderQuiz();
  window.app.showToast("info", "Quiz Reset", "You may now retake the assessment quiz.");
}

// --- Glossary Rendering ---
export function renderGlossary(searchTerm = "") {
  const container = document.getElementById("glossary-cards-container");
  if (!container) return;

  const filtered = GLOSSARY_TERMS.filter(item => {
    if (!searchTerm) return true;
    const termMatch = item.term.toLowerCase().includes(searchTerm.toLowerCase());
    const defMatch = item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return termMatch || defMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card text-center" style="grid-column: 1 / -1; padding: 30px;">No terminology found matching "${escapeHtml(searchTerm)}".</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => `
    <div class="glossary-card">
      <div class="glossary-term">
        <i class="fa-solid fa-bookmark text-accent" style="margin-right: 6px;"></i>
        ${escapeHtml(t.term)}
      </div>
      <div class="glossary-def">${escapeHtml(t.definition)}</div>
    </div>
  `).join("");
}

function setupTrainingEventListeners() {
  // Tab buttons
  const tabScenarios = document.getElementById("train-tab-scenarios");
  const tabQuiz = document.getElementById("train-tab-quiz");
  const tabGlossary = document.getElementById("train-tab-glossary");

  const secScenarios = document.getElementById("train-sec-scenarios");
  const secQuiz = document.getElementById("train-sec-quiz");
  const secGlossary = document.getElementById("train-sec-glossary");

  if (tabScenarios && tabQuiz && tabGlossary) {
    tabScenarios.addEventListener("click", () => {
      tabScenarios.classList.add("active");
      tabQuiz.classList.remove("active");
      tabGlossary.classList.remove("active");
      if (secScenarios) secScenarios.style.display = "block";
      if (secQuiz) secQuiz.style.display = "none";
      if (secGlossary) secGlossary.style.display = "none";
      activeTrainingTab = "scenarios";
    });

    tabQuiz.addEventListener("click", () => {
      tabQuiz.classList.add("active");
      tabScenarios.classList.remove("active");
      tabGlossary.classList.remove("active");
      if (secScenarios) secScenarios.style.display = "none";
      if (secQuiz) secQuiz.style.display = "block";
      if (secGlossary) secGlossary.style.display = "none";
      activeTrainingTab = "quiz";
    });

    tabGlossary.addEventListener("click", () => {
      tabGlossary.classList.add("active");
      tabScenarios.classList.remove("active");
      tabQuiz.classList.remove("active");
      if (secScenarios) secScenarios.style.display = "none";
      if (secQuiz) secQuiz.style.display = "none";
      if (secGlossary) secGlossary.style.display = "block";
      activeTrainingTab = "glossary";
    });
  }

  // Quiz submit & retake
  const btnSubmit = document.getElementById("btn-submit-quiz");
  if (btnSubmit) btnSubmit.addEventListener("click", submitQuiz);

  const btnRetake = document.getElementById("btn-retake-quiz");
  if (btnRetake) btnRetake.addEventListener("click", retakeQuiz);

  // Glossary search input
  const glossarySearch = document.getElementById("glossary-search-input");
  if (glossarySearch) {
    glossarySearch.addEventListener("input", (e) => {
      renderGlossary(e.target.value.trim());
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
