// LOGIN.JS — auth logic (localStorage session, ready for real backend)

// ─── Session helpers ───
function getSession()   { try { return JSON.parse(localStorage.getItem('sc-session') || 'null'); } catch { return null; } }
function saveSession(s) { localStorage.setItem('sc-session', JSON.stringify(s)); }
function clearSession() { localStorage.removeItem('sc-session'); }

function getUsers() { try { return JSON.parse(localStorage.getItem('sc-users') || '[]'); } catch { return []; } }
function saveUsers(u) { localStorage.setItem('sc-users', JSON.stringify(u)); }

// ─── Guard: if already logged in, go to app ───
if (getSession()) {
  window.location.href = 'index.html';
}

// ─── Tab switching ───
function showTab(tab) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('form-' + tab).classList.remove('hidden');
  if (tab !== 'forgot') document.getElementById('tab-' + tab)?.classList.add('active');
  clearErrors();
}

function showForgot() {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('form-forgot').classList.remove('hidden');
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(e => { e.classList.remove('visible'); e.textContent = ''; });
  document.querySelectorAll('.form-success').forEach(s => { s.classList.remove('visible'); s.textContent = ''; });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('visible'); }
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('visible'); }
}

// ─── Password toggle ───
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

// ─── Password strength ───
document.getElementById('signup-password')?.addEventListener('input', function() {
  const pw = this.value;
  const el = document.getElementById('pw-strength');
  if (!pw) { el.textContent = ''; el.style.color = ''; return; }
  if (pw.length < 6) {
    el.textContent = '◈ Weak';
    el.style.color = '#e05454';
  } else if (pw.length < 10 || !/[0-9]/.test(pw)) {
    el.textContent = '◈ Fair';
    el.style.color = '#e07a00';
  } else {
    el.textContent = '◈ Strong';
    el.style.color = '#2d8a4e';
  }
});

// ─── Sign In ───
function handleSignIn() {
  clearErrors();
  const email    = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  const remember = document.getElementById('remember-me').checked;

  if (!email)    return showError('signin-error', 'Please enter your email.');
  if (!password) return showError('signin-error', 'Please enter your password.');

  const users = getUsers();
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return showError('signin-error', 'No account found with that email. Try creating one!');
  }

  // Simple hash comparison (in production: bcrypt on server)
  if (user.passwordHash !== simpleHash(password)) {
    return showError('signin-error', 'Incorrect password. Please try again.');
  }

  const session = {
    id:        user.id,
    name:      user.name,
    email:     user.email,
    initials:  getInitials(user.name),
    loginAt:   Date.now(),
    remember,
  };

  saveSession(session);
  window.location.href = 'index.html';
}

// ─── Sign Up ───
function handleSignUp() {
  clearErrors();
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name)              return showError('signup-error', 'Please enter your name.');
  if (!email)             return showError('signup-error', 'Please enter your email.');
  if (!isValidEmail(email)) return showError('signup-error', 'Please enter a valid email address.');
  if (password.length < 8) return showError('signup-error', 'Password must be at least 8 characters.');

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return showError('signup-error', 'An account with that email already exists. Sign in instead!');
  }

  const newUser = {
    id:           'user-' + Date.now(),
    name,
    email,
    passwordHash: simpleHash(password),
    createdAt:    Date.now(),
  };

  users.push(newUser);
  saveUsers(users);

  const session = {
    id:       newUser.id,
    name:     newUser.name,
    email:    newUser.email,
    initials: getInitials(newUser.name),
    loginAt:  Date.now(),
    remember: true,
    isNew:    true,
  };

  saveSession(session);
  window.location.href = 'index.html';
}

// ─── Google Sign In (mock) ───
function handleGoogleSignIn() {
  // In production: trigger Google OAuth flow
  // For now: create a demo session
  const session = {
    id:       'google-demo',
    name:     'Suki Samara',
    email:    'suki@sukisamara.com',
    initials: 'SS',
    loginAt:  Date.now(),
    remember: true,
    provider: 'google',
  };
  saveSession(session);
  window.location.href = 'index.html';
}

// ─── Forgot password ───
function handleForgot() {
  clearErrors();
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) return showError('forgot-error', 'Please enter your email address.');
  if (!isValidEmail(email)) return showError('forgot-error', 'Please enter a valid email address.');
  // In production: send real reset email
  showSuccess('forgot-success', `✦ If an account exists for ${email}, we've sent a reset link. Check your inbox!`);
}

// ─── Utilities ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function simpleHash(str) {
  // NOT cryptographically secure — for demo only
  // In production: use bcrypt on server
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}
