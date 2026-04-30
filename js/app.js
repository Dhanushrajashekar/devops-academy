/* ===== DEVOPS ACADEMY — CORE APP ===== */

// ===== PROGRESS TRACKING =====
const Progress = {
  key: 'devops-academy-progress',

  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  },

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  complete(lessonId) {
    const data = this.get();
    data[lessonId] = true;
    this.set(data);
    this.updateUI();
  },

  isComplete(lessonId) {
    return !!this.get()[lessonId];
  },

  count() {
    return Object.values(this.get()).filter(Boolean).length;
  },

  total() {
    return document.querySelectorAll('[data-lesson]').length || 50;
  },

  percentage() {
    return Math.round((this.count() / this.total()) * 100);
  },

  updateUI() {
    const pct = this.percentage();
    const pctEls = document.querySelectorAll('.progress-pct');
    pctEls.forEach(el => el.textContent = pct + '%');

    // Update ring
    const rings = document.querySelectorAll('.progress-fill');
    rings.forEach(ring => {
      const r = ring.getAttribute('r') || 12;
      const circumference = 2 * Math.PI * r;
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    });

    // Update sidebar items
    const data = this.get();
    document.querySelectorAll('[data-lesson]').forEach(el => {
      const id = el.dataset.lesson;
      if (data[id]) {
        el.classList.add('completed');
        const check = el.querySelector('.check-icon');
        if (check) check.textContent = '✓';
      }
    });

    // Update module progress bars
    document.querySelectorAll('[data-module-progress]').forEach(bar => {
      const module = bar.dataset.moduleProgress;
      const moduleItems = document.querySelectorAll(`[data-lesson^="${module}"]`);
      const doneItems = Array.from(moduleItems).filter(el => data[el.dataset.lesson]);
      const pct = moduleItems.length ? Math.round((doneItems.length / moduleItems.length) * 100) : 0;
      const fill = bar.querySelector('.module-progress-fill');
      if (fill) fill.style.width = pct + '%';
    });
  }
};

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tab-list').forEach(tabList => {
    const tabs = tabList.querySelectorAll('.tab-btn');
    const container = tabList.closest('.tabs');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        if (contents[i]) contents[i].classList.add('active');
      });
    });

    // Activate first by default
    if (tabs[0]) tabs[0].click();
  });
}

// ===== ACCORDION (Lesson steps, Q&A) =====
function initAccordions() {
  // Lab steps
  document.querySelectorAll('.lab-step-header').forEach(header => {
    header.addEventListener('click', () => {
      const step = header.closest('.lab-step');
      const isOpen = step.classList.contains('open');
      // Close siblings
      step.closest('.lab-steps-list')?.querySelectorAll('.lab-step').forEach(s => s.classList.remove('open'));
      if (!isOpen) step.classList.add('open');
    });
  });

  // Q&A accordion
  document.querySelectorAll('.qa-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.qa-item');
      item.classList.toggle('open');
    });
  });
}

// ===== COPY CODE BUTTONS =====
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block');
      const code = block?.querySelector('pre')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '⎘ Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '⎘ Copy'; btn.classList.remove('copied'); }, 2000);
      });
    });
  });
}

// ===== LESSON NAVIGATION =====
function initLessonNav() {
  const lessons = document.querySelectorAll('[data-lesson]');
  const panels = document.querySelectorAll('.lesson-panel');

  function showLesson(id) {
    panels.forEach(p => p.classList.remove('active'));
    lessons.forEach(l => l.classList.remove('active'));

    const panel = document.querySelector(`.lesson-panel[data-panel="${id}"]`);
    const lesson = document.querySelector(`[data-lesson="${id}"]`);

    if (panel) { panel.classList.add('active'); panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    if (lesson) lesson.classList.add('active');

    // Mark step as active
    if (lesson) {
      const step = lesson.closest('.lab-step');
      if (step) {
        step.closest('.lab-steps-list')?.querySelectorAll('.lab-step').forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      }
    }

    window.location.hash = id;
  }

  lessons.forEach(lesson => {
    lesson.addEventListener('click', () => showLesson(lesson.dataset.lesson));
  });

  // Load from hash
  const hash = window.location.hash.slice(1);
  if (hash && document.querySelector(`[data-lesson="${hash}"]`)) {
    showLesson(hash);
  } else if (lessons[0]) {
    showLesson(lessons[0].dataset.lesson);
  }

  // Complete lesson buttons
  document.querySelectorAll('.complete-lesson-btn').forEach(btn => {
    const panelId = btn.closest('.lesson-panel')?.dataset.panel;
    if (!panelId) return;

    if (Progress.isComplete(panelId)) {
      btn.textContent = '✓ Completed';
      btn.classList.add('done');
    }

    btn.addEventListener('click', () => {
      Progress.complete(panelId);
      btn.textContent = '✓ Completed';
      btn.classList.add('done');
      const lessonEl = document.querySelector(`[data-lesson="${panelId}"]`);
      if (lessonEl) { lessonEl.classList.add('completed'); const c = lessonEl.querySelector('.check-icon'); if (c) c.textContent = '✓'; }

      // Auto-advance to next
      const allLessons = Array.from(lessons);
      const currentIdx = allLessons.findIndex(l => l.dataset.lesson === panelId);
      if (currentIdx < allLessons.length - 1) {
        const nextId = allLessons[currentIdx + 1].dataset.lesson;
        setTimeout(() => showLesson(nextId), 400);
      }
    });
  });
}

// ===== QUIZ ENGINE =====
class Quiz {
  constructor(containerId, questions) {
    this.container = document.getElementById(containerId);
    this.questions = questions;
    this.current = 0;
    this.score = 0;
    this.answered = false;
    if (this.container) this.render();
  }

  render() {
    if (this.current >= this.questions.length) {
      this.showScore();
      return;
    }

    const q = this.questions[this.current];
    this.answered = false;

    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <div class="quiz-title">Knowledge Check</div>
          <div class="quiz-counter">Question ${this.current + 1} of ${this.questions.length}</div>
        </div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-option" data-idx="${i}" onclick="quizzes['${this.container.id}'].answer(${i})">
              <span class="quiz-letter">${'ABCD'[i]}</span>
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="quiz-exp-${this.container.id}"></div>
        <div class="quiz-nav">
          <div></div>
          <button class="btn btn-primary btn-sm" id="quiz-next-${this.container.id}" style="display:none" onclick="quizzes['${this.container.id}'].next()">
            ${this.current < this.questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        </div>
      </div>
    `;
  }

  answer(idx) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.current];
    const opts = this.container.querySelectorAll('.quiz-option');
    const expEl = document.getElementById(`quiz-exp-${this.container.id}`);
    const nextBtn = document.getElementById(`quiz-next-${this.container.id}`);

    opts.forEach(opt => opt.disabled = true);

    if (idx === q.correct) {
      this.score++;
      opts[idx].classList.add('correct');
      expEl.className = 'quiz-explanation correct show';
      expEl.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
    } else {
      opts[idx].classList.add('wrong');
      opts[q.correct].classList.add('correct');
      expEl.className = 'quiz-explanation wrong show';
      expEl.innerHTML = `<strong>✗ Incorrect.</strong> The correct answer is <strong>${q.options[q.correct]}</strong>. ${q.explanation}`;
    }

    nextBtn.style.display = 'block';
  }

  next() {
    this.current++;
    this.render();
  }

  showScore() {
    const pct = Math.round((this.score / this.questions.length) * 100);
    const msg = pct === 100 ? '🎉 Perfect Score!' : pct >= 80 ? '🌟 Excellent!' : pct >= 60 ? '👍 Good Job!' : '📚 Keep Studying';
    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-score">
          <div class="score-num">${pct}%</div>
          <div class="score-label">${this.score} / ${this.questions.length} correct • ${msg}</div>
        </div>
        <div style="text-align:center; margin-top:20px">
          <button class="btn btn-secondary btn-sm" onclick="quizzes['${this.container.id}'].reset()">↺ Retry Quiz</button>
        </div>
      </div>
    `;
  }

  reset() {
    this.current = 0;
    this.score = 0;
    this.render();
  }
}

// Global quiz registry
window.quizzes = {};

function createQuiz(id, questions) {
  window.quizzes[id] = new Quiz(id, questions);
}

// ===== ACTIVE NAV LINK =====
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== LAB STEPS COMPLETE =====
function initLabStepComplete() {
  document.querySelectorAll('.step-complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.lab-step');
      if (!step) return;
      step.classList.add('done');
      step.classList.remove('open');
      btn.textContent = '✓ Done';
      btn.disabled = true;
      btn.style.background = 'var(--green-dark)';

      // Open next step
      const nextStep = step.nextElementSibling;
      if (nextStep && nextStep.classList.contains('lab-step')) {
        nextStep.classList.add('open', 'active');
      }
    });
  });
}

// ===== SEARCH COMMANDS =====
function initCommandSearch() {
  const searchInput = document.getElementById('command-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.cheatsheet-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== LOAD COMMANDS INTO TERMINAL =====
function runTerminalCommand(terminalId, cmd) {
  const terminal = document.getElementById(terminalId);
  if (!terminal) return;
  const input = terminal.querySelector('.terminal-input');
  if (input) {
    input.value = cmd;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  }
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  Progress.updateUI();
  initTabs();
  initAccordions();
  initCopyButtons();
  initLessonNav();
  initLabStepComplete();
  initCommandSearch();
  initSmoothScroll();

  // Open first lab step
  const firstStep = document.querySelector('.lab-step');
  if (firstStep) firstStep.classList.add('open', 'active');
});
