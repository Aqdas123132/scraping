/* ============================================
   AutoFlow OS — Login Page JavaScript
   login.js
   ============================================ */

/* ---- LIVE CLOCK ---- */
function updateClock() {
  const el = document.getElementById('live-time');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ---- STAT COUNTER ANIMATION ---- */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

window.addEventListener('DOMContentLoaded', () => {
  const counters = [
    { selector: '.stat-num:not(.amber):not(.cyan)', values: [53, 18] },
  ];
  document.querySelectorAll('.stat-num').forEach((el) => {
    const raw = el.textContent.trim();
    if (raw.startsWith('$')) return;
    const num = parseInt(raw.replace(/[^0-9]/g, ''));
    if (!isNaN(num)) {
      el.textContent = '0';
      setTimeout(() => animateCounter(el, num), 400);
    }
  });
});

/* ---- TAB SWITCHER ---- */
function switchTab(tab) {
  const loginPanel = document.getElementById('panel-login');
  const signupPanel = document.getElementById('panel-signup');
  const loginBtn = document.getElementById('tab-login');
  const signupBtn = document.getElementById('tab-signup');
  const indicator = document.getElementById('tab-indicator');

  if (tab === 'login') {
    loginPanel.classList.remove('hidden');
    signupPanel.classList.add('hidden');
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    indicator.classList.remove('right');
  } else {
    signupPanel.classList.remove('hidden');
    loginPanel.classList.add('hidden');
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    indicator.classList.add('right');
  }

  // Animate in
  const activePanel = tab === 'login' ? loginPanel : signupPanel;
  activePanel.style.opacity = '0';
  activePanel.style.transform = 'translateY(10px)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      activePanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      activePanel.style.opacity = '1';
      activePanel.style.transform = 'translateY(0)';
    });
  });
}

/* ---- TOGGLE PASSWORD VISIBILITY ---- */
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.color = 'var(--accent-cyan)';
  } else {
    input.type = 'password';
    btn.style.color = '';
  }
}

/* ---- PASSWORD STRENGTH ---- */
function checkStrength(value) {
  const fill = document.getElementById('strength-fill');
  const text = document.getElementById('strength-text');
  if (!fill || !text) return;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  if (value.length >= 14) score++;

  const levels = [
    { pct: '0%', color: 'transparent', label: '' },
    { pct: '20%', color: '#ef4444', label: 'WEAK' },
    { pct: '45%', color: '#f59e0b', label: 'FAIR' },
    { pct: '70%', color: '#38bdf8', label: 'GOOD' },
    { pct: '90%', color: '#22c55e', label: 'STRONG' },
    { pct: '100%', color: '#22c55e', label: 'VERY STRONG' },
  ];

  const level = levels[score] || levels[0];
  fill.style.width = level.pct;
  fill.style.background = level.color;
  text.textContent = level.label;
  text.style.color = level.color;
}

/* ---- VALIDATION HELPERS ---- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function setStatus(id, icon) {
  const el = document.getElementById(id);
  if (el) { el.textContent = icon; el.style.opacity = '1'; }
}

function shakeField(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.style.borderColor = 'var(--accent-red)';
  input.style.animation = 'none';
  requestAnimationFrame(() => {
    input.style.animation = 'shake 0.4s ease';
  });
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.animation = '';
  }, 800);
}

/* Add shake keyframes dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);

/* ---- TOAST ---- */
function showToast(msg, icon = '✓', type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  if (!toast) return;

  toastMsg.textContent = msg;
  toastIcon.textContent = icon;
  toast.style.borderColor = type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---- LOADING STATE ---- */
function setLoading(btnId, loaderId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/* ---- HANDLE LOGIN ---- */
async function handleLogin(e) {
  e.preventDefault();
  clearError('login-email-err');
  clearError('login-pass-err');

  const email = document.getElementById('login-email')?.value.trim() || '';
  const pass = document.getElementById('login-pass')?.value || '';
  let valid = true;

  if (!email) {
    setError('login-email-err', 'Email is required');
    shakeField('login-email');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('login-email-err', 'Enter a valid email address');
    shakeField('login-email');
    valid = false;
  } else {
    setStatus('login-email-status', '✓');
  }

  if (!pass) {
    setError('login-pass-err', 'Password is required');
    shakeField('login-pass');
    valid = false;
  } else if (pass.length < 6) {
    setError('login-pass-err', 'Password must be at least 6 characters');
    shakeField('login-pass');
    valid = false;
  }

  if (!valid) return;

  setLoading('login-submit-btn', 'login-loader', true);

  // Simulate API call — replace with your real auth logic
  await new Promise(resolve => setTimeout(resolve, 1800));

  setLoading('login-submit-btn', 'login-loader', false);

  // =============================================
  // 🔌 CONNECT TO YOUR BACKEND HERE:
  //
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password: pass })
  // });
  // const data = await response.json();
  // if (response.ok) {
  //   localStorage.setItem('authToken', data.token);
  //   window.location.href = '/dashboard.html';
  // } else {
  //   showToast(data.message || 'Login failed', '✗', 'error');
  // }
  // =============================================
showToast('Access granted — redirecting...', '✓', 'success');
localStorage.setItem('autoflow_loggedIn', 'true');
setTimeout(() => {
  window.location.href = 'mainpage2.html';
}, 1500);
}

/* ---- HANDLE SIGNUP ---- */
async function handleSignup(e) {
  e.preventDefault();
  const fields = ['signup-fname-err','signup-lname-err','signup-email-err','signup-pass-err','signup-confirm-err'];
  fields.forEach(clearError);

  const fname = document.getElementById('signup-fname')?.value.trim() || '';
  const lname = document.getElementById('signup-lname')?.value.trim() || '';
  const email = document.getElementById('signup-email')?.value.trim() || '';
  const pass = document.getElementById('signup-pass')?.value || '';
  const confirm = document.getElementById('signup-confirm')?.value || '';
  const terms = document.getElementById('terms-check')?.checked;
  let valid = true;

  if (!fname) { setError('signup-fname-err', 'First name required'); shakeField('signup-fname'); valid = false; }
  if (!lname) { setError('signup-lname-err', 'Last name required'); shakeField('signup-lname'); valid = false; }
  if (!email || !isValidEmail(email)) { setError('signup-email-err', 'Enter a valid email'); shakeField('signup-email'); valid = false; }
  if (pass.length < 8) { setError('signup-pass-err', 'Min 8 characters required'); shakeField('signup-pass'); valid = false; }
  if (pass !== confirm) { setError('signup-confirm-err', 'Passwords do not match'); shakeField('signup-confirm'); setStatus('signup-confirm-status', ''); valid = false; }
  else if (confirm) { setStatus('signup-confirm-status', '✓'); }
  if (!terms) { showToast('Please accept the terms first', '!', 'error'); valid = false; }

  if (!valid) return;

  setLoading('signup-submit-btn', 'signup-loader', true);

  await new Promise(resolve => setTimeout(resolve, 1800));

  setLoading('signup-submit-btn', 'signup-loader', false);

  // =============================================
  // 🔌 CONNECT TO YOUR BACKEND HERE:
  //
  // const response = await fetch('/api/auth/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ firstName: fname, lastName: lname, email, password: pass })
  // });
  // const data = await response.json();
  // if (response.ok) {
  //   showToast('Account created! Check your email.', '✓', 'success');
  //   setTimeout(() => switchTab('login'), 1500);
  // } else {
  //   showToast(data.message || 'Signup failed', '✗', 'error');
  // }
  // =============================================

  // Demo success:
  showToast('Account created! Check your email.', '✓', 'success');
  setTimeout(() => { window.location.href = 'mainpage2.html'; }, 1800);
}

function socialLogin(provider) {
  showToast(`Connecting to ${provider}...`, '↗', 'success');
  setTimeout(() => {
    window.location.href = 'mainpage2.html';   // ← ye line add karo
  }, 1500);
}

/* ---- REAL-TIME CONFIRM CHECK ---- */
document.addEventListener('DOMContentLoaded', () => {
  const confirmInput = document.getElementById('signup-confirm');
  const passInput = document.getElementById('signup-pass');
  if (confirmInput && passInput) {
    confirmInput.addEventListener('input', () => {
      const statusEl = document.getElementById('signup-confirm-status');
      if (!statusEl) return;
      if (confirmInput.value && confirmInput.value === passInput.value) {
        statusEl.textContent = '✓';
        statusEl.style.opacity = '1';
        statusEl.style.color = 'var(--accent-green)';
      } else {
        statusEl.textContent = '';
      }
    });
  }
});
