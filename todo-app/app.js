// ═══════════════════════════════════════════════════
// TaskFlow — app.js  (versão final)
// localStorage key: "taskflow_db"
// DB shape: { users: [], todos: [] }
// ═══════════════════════════════════════════════════

// ─── Constants ─────────────────────────────────────
const DB_KEY      = 'taskflow_db';
const SESSION_KEY = 'currentUser';

// ─── DB Helpers ─────────────────────────────────────
function getDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || { users: [], todos: [] }; }
  catch { return { users: [], todos: [] }; }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ─── Session Helpers ────────────────────────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Screen Router ──────────────────────────────────
const screens = {
  login:     document.getElementById('screen-login'),
  register:  document.getElementById('screen-register'),
  dashboard: document.getElementById('screen-dashboard'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ─── Validation Helpers ─────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  if (msg) el.textContent = '⚠ ' + msg;
  el.classList.add('visible');
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

function clearAllErrors(...ids) {
  ids.forEach(clearFieldError);
}

// ─── Toast Notification ─────────────────────────────
const toastContainer = document.getElementById('toast-container');

/**
 * @param {string} message
 * @param {'success'|'error'|'info'|'warn'} type
 */
function showToast(message, type = 'info') {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:1rem;flex-shrink:0">${icons[type]}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// ─── Delete Confirmation Modal ───────────────────────
const modalOverlay = document.getElementById('modal-overlay');
let pendingDeleteId = null;

function openDeleteModal(id) {
  pendingDeleteId = id;
  modalOverlay.classList.add('open');
}

function closeDeleteModal() {
  pendingDeleteId = null;
  modalOverlay.classList.remove('open');
}

document.getElementById('modal-cancel').addEventListener('click', closeDeleteModal);

document.getElementById('modal-confirm').addEventListener('click', () => {
  if (pendingDeleteId === null) return;
  confirmDelete(pendingDeleteId);
  closeDeleteModal();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeDeleteModal();
});

// ─── LOGIN ───────────────────────────────────────────
const formLogin  = document.getElementById('form-login');
const loginEmail = document.getElementById('login-email');
const loginPass  = document.getElementById('login-password');

formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors('login-email-err', 'login-password-err', 'login-global-err');

  const email = loginEmail.value.trim();
  const pass  = loginPass.value;
  let valid   = true;

  if (!email || !isValidEmail(email)) { clearFieldError('login-email-err'); showFieldError('login-email-err'); valid = false; }
  if (!pass)                           { clearFieldError('login-password-err'); showFieldError('login-password-err'); valid = false; }
  if (!valid) return;

  const db   = getDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    showFieldError('login-global-err', 'E-mail não cadastrado.');
    return;
  }
  if (user.password !== pass) {
    showFieldError('login-global-err', 'Senha incorreta. Tente novamente.');
    return;
  }

  setCurrentUser({ name: user.name, email: user.email });
  formLogin.reset();
  openDashboard();
  showToast(`Bem-vindo de volta, ${user.name.split(' ')[0]}! 👋`, 'success');
});

// ─── REGISTER ───────────────────────────────────────
const formRegister = document.getElementById('form-register');
const regName      = document.getElementById('reg-name');
const regEmail     = document.getElementById('reg-email');
const regPass      = document.getElementById('reg-password');

formRegister.addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors('reg-name-err', 'reg-email-err', 'reg-password-err', 'reg-global-err');

  const name  = regName.value.trim();
  const email = regEmail.value.trim();
  const pass  = regPass.value;
  let valid   = true;

  if (!name)                             { showFieldError('reg-name-err'); valid = false; }
  if (!email || !isValidEmail(email))    { showFieldError('reg-email-err'); valid = false; }
  if (!pass || pass.length < 6)          { showFieldError('reg-password-err'); valid = false; }
  if (!valid) return;

  const db = getDB();
  if (db.users.some(u => u.email === email)) {
    showFieldError('reg-global-err', 'Este e-mail já está cadastrado.');
    return;
  }

  db.users.push({ name, email, password: pass });
  saveDB(db);

  setCurrentUser({ name, email });
  formRegister.reset();
  openDashboard();
  showToast(`Conta criada! Bem-vindo, ${name.split(' ')[0]}! 🎉`, 'success');
});

// ─── NAVIGATION ─────────────────────────────────────
document.getElementById('go-register').addEventListener('click', () => {
  clearAllErrors('login-email-err', 'login-password-err', 'login-global-err');
  showScreen('register');
});

document.getElementById('go-login').addEventListener('click', () => {
  clearAllErrors('reg-name-err', 'reg-email-err', 'reg-password-err', 'reg-global-err');
  showScreen('login');
});

// ─── LOGOUT ─────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', () => {
  clearCurrentUser();
  currentFilter = 'all';
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === 'all');
  });
  showScreen('login');
  showToast('Sessão encerrada. Até logo!', 'info');
});

// ─── DASHBOARD ──────────────────────────────────────
function openDashboard() {
  const user = getCurrentUser();
  if (!user) { showScreen('login'); return; }
  document.getElementById('user-greeting').textContent = user.name;
  renderTasks();
  showScreen('dashboard');
}

// ─── FILTER STATE ───────────────────────────────────
let currentFilter = 'all';

document.getElementById('filter-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-tab');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t === btn);
  });
  renderTasks();
});

// ─── TASK FORM ──────────────────────────────────────
const formTask  = document.getElementById('form-task');
const taskTitle = document.getElementById('task-title');
const taskType  = document.getElementById('task-type');
const taskDesc  = document.getElementById('task-desc');

formTask.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFieldError('task-title-err');

  const title = taskTitle.value.trim();
  if (!title) {
    showFieldError('task-title-err');
    taskTitle.focus();
    return;
  }

  const user = getCurrentUser();
  const db   = getDB();

  /** @type {Todo} */
  const todo = {
    id:          Date.now(),
    userId:      user.email,
    title,
    type:        taskType.value,
    description: taskDesc.value.trim(),
    done:        false,
    createdAt:   new Date().toISOString(),
  };

  db.todos.push(todo);
  saveDB(db);

  // Reset form but keep category selection intentional
  taskTitle.value = '';
  taskDesc.value  = '';
  taskType.selectedIndex = 0;

  renderTasks();
  taskTitle.focus();
  showToast('Tarefa adicionada! ✓', 'success');
});

// ─── TASK ACTIONS ────────────────────────────────────
function toggleDone(id) {
  const db  = getDB();
  const idx = db.todos.findIndex(t => t.id === id);
  if (idx === -1) return;
  db.todos[idx].done = !db.todos[idx].done;
  saveDB(db);
  renderTasks();

  const msg = db.todos[idx].done ? 'Tarefa concluída! 🎯' : 'Tarefa reaberta.';
  showToast(msg, db.todos[idx].done ? 'success' : 'info');
}

function confirmDelete(id) {
  const db = getDB();
  db.todos = db.todos.filter(t => t.id !== id);
  saveDB(db);
  renderTasks();
  showToast('Tarefa excluída.', 'warn');
}

// ─── RENDER ──────────────────────────────────────────
function renderTasks() {
  const user  = getCurrentUser();
  if (!user) return;

  const db        = getDB();
  const userTodos = db.todos.filter(t => t.userId === user.email);

  // Progress
  const total = userTodos.length;
  const done  = userTodos.filter(t => t.done).length;
  updateProgress(done, total);

  // Apply filter
  let filtered;
  if      (currentFilter === 'pending') filtered = userTodos.filter(t => !t.done);
  else if (currentFilter === 'done')    filtered = userTodos.filter(t =>  t.done);
  else                                  filtered  = [...userTodos.filter(t => !t.done), ...userTodos.filter(t => t.done)];

  // Counter reflects total, not filtered
  document.getElementById('task-count').textContent = total;

  const taskList  = document.getElementById('task-list');
  const taskEmpty = document.getElementById('task-empty');

  if (filtered.length === 0) {
    taskList.innerHTML = '';
    taskEmpty.classList.remove('hidden');
    return;
  }

  taskEmpty.classList.add('hidden');
  taskList.innerHTML = filtered.map(buildTaskCard).join('');

  taskList.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleDone(Number(btn.dataset.toggle)));
  });
  taskList.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.delete)));
  });
}

function updateProgress(done, total) {
  const section = document.getElementById('progress-section');
  const fill    = document.getElementById('progress-fill');
  const label   = document.getElementById('progress-label');

  if (total === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  const pct = Math.round((done / total) * 100);
  fill.style.width  = pct + '%';
  label.textContent = `${done} / ${total} concluída${done !== 1 ? 's' : ''}`;
}

// ─── TASK CARD BUILDER ───────────────────────────────
const BADGE_CLASS = { trabalho: 'badge-trabalho', pessoal: 'badge-pessoal', estudos: 'badge-estudos' };
const BADGE_LABEL = { trabalho: '💼 Trabalho', pessoal: '👤 Pessoal', estudos: '📚 Estudos' };

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function buildTaskCard(todo) {
  const doneClass  = todo.done ? 'done-card' : '';
  const checkIcon  = todo.done
    ? `<div class="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="20 6 9 17 4 12"/>
         </svg>
       </div>`
    : `<div class="w-5 h-5 rounded-full border border-slate-600/50 flex-shrink-0"></div>`;

  const descHTML = todo.description
    ? `<p class="text-slate-500 text-xs mt-1.5 leading-relaxed">${escapeHTML(todo.description)}</p>`
    : '';

  const dateHTML = todo.createdAt
    ? `<span class="text-slate-600 text-[0.68rem]">${formatDate(todo.createdAt)}</span>`
    : '';

  const toggleBtn = todo.done
    ? `<button data-toggle="${todo.id}" class="btn-reopen-sm">Reabrir</button>`
    : `<button data-toggle="${todo.id}" class="btn-success-sm">Concluir</button>`;

  return `
    <div class="glass rounded-xl p-4 task-card ${doneClass}">
      <div class="flex items-start gap-3">
        <div class="mt-0.5">${checkIcon}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-0.5">
            <span class="task-title text-white text-sm font-medium leading-snug">${escapeHTML(todo.title)}</span>
            <span class="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full ${BADGE_CLASS[todo.type] || 'badge-trabalho'}">${BADGE_LABEL[todo.type] || todo.type}</span>
          </div>
          ${descHTML}
          ${dateHTML}
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          ${toggleBtn}
          <button data-delete="${todo.id}" class="btn-danger-ghost" title="Excluir">✕</button>
        </div>
      </div>
    </div>
  `;
}

// ─── XSS protection ──────────────────────────────────
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// ─── KEYBOARD SHORTCUTS ──────────────────────────────
document.addEventListener('keydown', (e) => {
  // Escape closes modal
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeDeleteModal();
  }
});

// ─── INIT ─────────────────────────────────────────────
(function init() {
  const user = getCurrentUser();
  if (user) {
    openDashboard();
  } else {
    showScreen('login');
  }
})();
