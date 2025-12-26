'use strict';

const ISSUES_KEY = 'cis_issues';
const CURRENT_USER_KEY = 'cis_currentUser';

// Basic session lookup from LocalStorage
const getCurrentUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

const getIssues = () => JSON.parse(localStorage.getItem(ISSUES_KEY) || '[]');
const saveIssues = (issues) => localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));

// Redirect if the session is missing or the role is wrong
const requireStudent = () => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  if (user.role !== 'Student') {
    window.location.href = 'admin.html';
    return null;
  }
  return user;
};

const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'index.html';
};

const renderIssues = (issues, user) => {
  const tableBody = document.getElementById('studentIssues');
  const emptyState = document.getElementById('emptyState');
  tableBody.innerHTML = '';

  const userIssues = issues.filter((issue) => issue.studentEmail === user.email);

  if (userIssues.length === 0) {
    emptyState.textContent = 'No issues submitted yet. Use the form above to create one.';
    return;
  }

  emptyState.textContent = '';

  userIssues.forEach((issue) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td>${issue.category}</td>
      <td><span class="badge ${issue.status === 'Pending' ? 'pending' : issue.status === 'In Progress' ? 'progress' : 'resolved'}">${issue.status}</span></td>
      <td><span class="badge ${issue.priority === 'High' ? 'priority-high' : issue.priority === 'Medium' ? 'priority-medium' : 'priority-low'}">${issue.priority}</span></td>
      <td>${issue.createdAt}</td>
    `;
    tableBody.appendChild(tr);
  });
};

// Create a new issue owned by the logged-in student
const handleIssueSubmit = (event, user) => {
  event.preventDefault();
  const title = document.getElementById('issueTitle').value.trim();
  const category = document.getElementById('issueCategory').value;
  const description = document.getElementById('issueDescription').value.trim();
  const messageEl = document.getElementById('issueMessage');

  if (!title || !description) {
    messageEl.textContent = 'Please complete all fields.';
    messageEl.style.color = 'var(--danger)';
    return;
  }

  const issues = getIssues();
  const newIssue = {
    id: `ISS-${Date.now()}`,
    studentName: user.name,
    studentEmail: user.email,
    title,
    category,
    description,
    status: 'Pending',
    priority: 'Low',
    createdAt: new Date().toLocaleString(),
  };

  issues.unshift(newIssue);
  saveIssues(issues);
  messageEl.textContent = 'Issue submitted successfully.';
  messageEl.style.color = 'var(--success)';
  event.target.reset();
  renderIssues(issues, user);
};

const initStudentPage = () => {
  const user = requireStudent();
  if (!user) return;

  const issues = getIssues();
  renderIssues(issues, user);

  const form = document.getElementById('issueForm');
  form.addEventListener('submit', (event) => handleIssueSubmit(event, user));

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);
};

document.addEventListener('DOMContentLoaded', initStudentPage);
