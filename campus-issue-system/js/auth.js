'use strict';

// Storage keys keep data names consistent across pages
const USERS_KEY = 'cis_users';
const CURRENT_USER_KEY = 'cis_currentUser';

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const saveCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const getCurrentUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

// Simple obfuscation for demo purposes only (not secure hashing)
const hashPassword = (password) => btoa(unescape(encodeURIComponent(password)));

const redirectByRole = (role) => {
  if (role === 'Student') {
    window.location.href = 'student.html';
  } else if (role === 'Admin') {
    window.location.href = 'admin.html';
  }
};

const handleRegister = (event) => {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;
  const messageEl = document.getElementById('registerMessage');

  if (!name || !email || !password) {
    messageEl.textContent = 'All fields are required.';
    messageEl.style.color = 'var(--danger)';
    return;
  }

  const users = getUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    messageEl.textContent = 'An account with this email already exists.';
    messageEl.style.color = 'var(--danger)';
    return;
  }

  const newUser = {
    name,
    email,
    password: hashPassword(password),
    role,
  };

  users.push(newUser);
  saveUsers(users);
  messageEl.textContent = 'Registration successful. You can login now.';
  messageEl.style.color = 'var(--success)';
  event.target.reset();
};

const handleLogin = (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const role = document.getElementById('loginRole').value;
  const messageEl = document.getElementById('loginMessage');

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.role === role);

  if (!user) {
    messageEl.textContent = 'No account found for this email and role.';
    messageEl.style.color = 'var(--danger)';
    return;
  }

  if (user.password !== hashPassword(password)) {
    messageEl.textContent = 'Incorrect password.';
    messageEl.style.color = 'var(--danger)';
    return;
  }

  saveCurrentUser({ name: user.name, email: user.email, role: user.role });
  redirectByRole(user.role);
};

const guardRedirectIfLoggedIn = () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    redirectByRole(currentUser.role);
  }
};

const initAuthPage = () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  guardRedirectIfLoggedIn();
};

document.addEventListener('DOMContentLoaded', initAuthPage);
