/* ===== DEVOPS ACADEMY — SUPABASE AUTH + PROGRESS SYNC ===== */

(function () {
  // Bail out gracefully if not configured
  if (
    typeof window.supabase === 'undefined' ||
    typeof SUPABASE_URL === 'undefined' ||
    SUPABASE_URL === 'YOUR_SUPABASE_URL'
  ) {
    console.info('DevOps Academy: Supabase not configured — progress stored locally only.');
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let currentUser = null;

  // ===== TOAST NOTIFICATIONS =====
  function showToast(msg, type = 'info') {
    const existing = document.getElementById('da-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'da-toast';
    toast.className = `da-toast da-toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('da-toast-show'));
    setTimeout(() => {
      toast.classList.remove('da-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== INJECT AUTH MODAL =====
  function injectModal() {
    const html = `
      <div id="da-auth-overlay" class="da-overlay" style="display:none">
        <div class="da-modal">
          <button class="da-modal-close" id="da-modal-close">✕</button>
          <div class="da-modal-brand">
            <span style="font-size:1.8rem">🚀</span>
            <div>
              <div class="da-modal-title">DevOps Academy</div>
              <div class="da-modal-subtitle">Sign in to sync your progress across devices</div>
            </div>
          </div>

          <div class="da-tabs">
            <button class="da-tab active" data-tab="signin">Sign In</button>
            <button class="da-tab" data-tab="signup">Create Account</button>
          </div>

          <div id="da-tab-signin" class="da-tab-panel active">
            <div class="da-form-group">
              <label class="da-label">Email</label>
              <input type="email" id="da-signin-email" class="da-input" placeholder="you@example.com" autocomplete="email">
            </div>
            <div class="da-form-group">
              <label class="da-label">Password</label>
              <input type="password" id="da-signin-pass" class="da-input" placeholder="••••••••" autocomplete="current-password">
            </div>
            <div id="da-signin-error" class="da-form-error"></div>
            <button id="da-signin-btn" class="da-btn-primary">Sign In →</button>
          </div>

          <div id="da-tab-signup" class="da-tab-panel">
            <div class="da-form-group">
              <label class="da-label">Email</label>
              <input type="email" id="da-signup-email" class="da-input" placeholder="you@example.com" autocomplete="email">
            </div>
            <div class="da-form-group">
              <label class="da-label">Password</label>
              <input type="password" id="da-signup-pass" class="da-input" placeholder="Min 6 characters" autocomplete="new-password">
            </div>
            <div id="da-signup-error" class="da-form-error"></div>
            <button id="da-signup-btn" class="da-btn-primary">Create Account →</button>
          </div>

          <p class="da-modal-note">Your progress, quiz scores, and terminal history sync automatically once you're signed in.</p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ===== INJECT NAV AUTH BUTTON =====
  function injectNavAuth() {
    const navProgress = document.querySelector('.nav-progress');
    if (!navProgress) return;

    const btn = document.createElement('div');
    btn.id = 'da-nav-auth';
    btn.className = 'da-nav-auth';
    btn.innerHTML = `<button class="da-login-btn" id="da-open-modal">Login</button>`;
    navProgress.parentNode.insertBefore(btn, navProgress);
  }

  // ===== UPDATE NAV UI =====
  function updateNavUI() {
    const container = document.getElementById('da-nav-auth');
    if (!container) return;

    if (currentUser) {
      const email = currentUser.email || '';
      const initials = email.slice(0, 2).toUpperCase();
      const colors = ['#58a6ff', '#a371f7', '#3fb950', '#f0883e', '#39d353'];
      const color = colors[email.charCodeAt(0) % colors.length];

      container.innerHTML = `
        <div class="da-user-menu" id="da-user-menu">
          <button class="da-avatar" style="background:${color}" id="da-avatar-btn">${initials}</button>
          <div class="da-dropdown" id="da-dropdown">
            <div class="da-dropdown-email">${email}</div>
            <div class="da-dropdown-divider"></div>
            <div class="da-dropdown-row">
              <span class="da-dropdown-stat" id="dd-lessons">— lessons</span>
              <span class="da-dropdown-stat" id="dd-pct">—%</span>
            </div>
            <div class="da-dropdown-divider"></div>
            <button class="da-signout-btn" id="da-signout-btn">Sign Out</button>
          </div>
        </div>
      `;

      const avatarBtn = document.getElementById('da-avatar-btn');
      const dropdown = document.getElementById('da-dropdown');
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        updateDropdownStats();
      });
      document.addEventListener('click', () => dropdown.classList.remove('open'));

      document.getElementById('da-signout-btn').addEventListener('click', signOut);
    } else {
      container.innerHTML = `<button class="da-login-btn" id="da-open-modal">Login</button>`;
      document.getElementById('da-open-modal').addEventListener('click', openModal);
    }
  }

  function updateDropdownStats() {
    const count = typeof Progress !== 'undefined' ? Progress.count() : 0;
    const pct = typeof Progress !== 'undefined' ? Progress.percentage() : 0;
    const el1 = document.getElementById('dd-lessons');
    const el2 = document.getElementById('dd-pct');
    if (el1) el1.textContent = `${count} lessons done`;
    if (el2) el2.textContent = `${pct}% complete`;
  }

  // ===== MODAL OPEN/CLOSE =====
  function openModal() {
    document.getElementById('da-auth-overlay').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('da-auth-overlay').style.display = 'none';
    clearErrors();
  }

  function clearErrors() {
    ['da-signin-error', 'da-signup-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  // ===== BIND MODAL EVENTS =====
  function bindModalEvents() {
    document.getElementById('da-modal-close').addEventListener('click', closeModal);
    document.getElementById('da-auth-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'da-auth-overlay') closeModal();
    });

    // Tab switching
    document.querySelectorAll('.da-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.da-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.da-tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`da-tab-${tab.dataset.tab}`).classList.add('active');
        clearErrors();
      });
    });

    // Sign in
    document.getElementById('da-signin-btn').addEventListener('click', async () => {
      const email = document.getElementById('da-signin-email').value.trim();
      const pass = document.getElementById('da-signin-pass').value;
      const errEl = document.getElementById('da-signin-error');

      if (!email || !pass) { errEl.textContent = 'Please fill in all fields.'; return; }

      const btn = document.getElementById('da-signin-btn');
      btn.textContent = 'Signing in…';
      btn.disabled = true;

      const { error } = await db.auth.signInWithPassword({ email, password: pass });
      if (error) {
        errEl.textContent = error.message;
        btn.textContent = 'Sign In →';
        btn.disabled = false;
      } else {
        closeModal();
      }
    });

    // Sign up
    document.getElementById('da-signup-btn').addEventListener('click', async () => {
      const email = document.getElementById('da-signup-email').value.trim();
      const pass = document.getElementById('da-signup-pass').value;
      const errEl = document.getElementById('da-signup-error');

      if (!email || !pass) { errEl.textContent = 'Please fill in all fields.'; return; }
      if (pass.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; return; }

      const btn = document.getElementById('da-signup-btn');
      btn.textContent = 'Creating account…';
      btn.disabled = true;

      const { error } = await db.auth.signUp({ email, password: pass });
      if (error) {
        errEl.textContent = error.message;
        btn.textContent = 'Create Account →';
        btn.disabled = false;
      } else {
        errEl.style.color = 'var(--green)';
        errEl.textContent = 'Account created! Check your email to confirm, then sign in.';
        btn.textContent = 'Create Account →';
        btn.disabled = false;
      }
    });

    // Enter key on inputs
    ['da-signin-email', 'da-signin-pass'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('da-signin-btn').click();
      });
    });
    ['da-signup-email', 'da-signup-pass'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('da-signup-btn').click();
      });
    });
  }

  // ===== SIGN OUT =====
  async function signOut() {
    await db.auth.signOut();
  }

  // ===== LOAD PROGRESS FROM SUPABASE =====
  async function loadProgress() {
    if (!currentUser) return;

    const { data, error } = await db
      .from('progress')
      .select('lesson_id')
      .eq('user_id', currentUser.id);

    if (error) { console.error('Load progress error:', error); return; }

    const stored = typeof Progress !== 'undefined' ? Progress.get() : {};
    data.forEach(row => { stored[row.lesson_id] = true; });

    if (typeof Progress !== 'undefined') {
      Progress.set(stored);
      Progress.updateUI();
    }
  }

  // ===== SAVE LESSON TO SUPABASE =====
  async function saveLesson(lessonId) {
    if (!currentUser) return;
    await db.from('progress').upsert(
      { user_id: currentUser.id, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id' }
    );
  }

  // ===== SAVE QUIZ SCORE TO SUPABASE =====
  async function saveQuizScore(quizId, score, total) {
    if (!currentUser) return;
    const pct = Math.round((score / total) * 100);
    await db.from('quiz_scores').insert({
      user_id: currentUser.id,
      quiz_id: quizId,
      score,
      total,
      percentage: pct
    });
  }

  // ===== SAVE TERMINAL COMMAND TO SUPABASE =====
  async function saveCommand(module, command) {
    if (!currentUser) return;
    await db.from('terminal_history').insert({
      user_id: currentUser.id,
      module,
      command
    });
  }

  // ===== PATCH Progress.complete =====
  function patchProgress() {
    if (typeof Progress === 'undefined') return;
    const orig = Progress.complete.bind(Progress);
    Progress.complete = function (lessonId) {
      orig(lessonId);
      saveLesson(lessonId);
    };
  }

  // ===== PATCH Quiz.prototype.showScore =====
  function patchQuiz() {
    if (typeof Quiz === 'undefined') return;
    const orig = Quiz.prototype.showScore;
    Quiz.prototype.showScore = function () {
      const id = this.container ? this.container.id : 'unknown';
      const score = this.score;
      const total = this.questions.length;
      orig.call(this);
      saveQuizScore(id, score, total);
    };
  }

  // ===== PATCH DevOpsTerminal.prototype.executeCommand =====
  function patchTerminal() {
    if (typeof DevOpsTerminal === 'undefined') return;
    const orig = DevOpsTerminal.prototype.executeCommand;
    DevOpsTerminal.prototype.executeCommand = function (cmd) {
      orig.call(this, cmd);
      saveCommand(this.context || 'general', cmd);
    };
  }

  // ===== INIT =====
  async function init() {
    injectModal();
    injectNavAuth();
    bindModalEvents();
    patchProgress();
    patchQuiz();
    patchTerminal();

    // Check existing session
    const { data: { session } } = await db.auth.getSession();
    if (session) {
      currentUser = session.user;
      await loadProgress();
      showToast('Welcome back! Progress synced.', 'success');
    }
    updateNavUI();

    // Listen for auth changes
    db.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        currentUser = session.user;
        await loadProgress();
        updateNavUI();
        showToast('Signed in! Progress synced across devices.', 'success');
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateNavUI();
        showToast('Signed out successfully.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
