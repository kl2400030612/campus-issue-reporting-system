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
const requireAdmin = () => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  if (user.role !== 'Admin') {
    window.location.href = 'student.html';
    return null;
  }
  return user;
};

const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'index.html';
};

// Enforce the simple linear status progression
const nextStatus = (status) => {
  if (status === 'Pending') return 'In Progress';
  if (status === 'In Progress') return 'Resolved';
  return 'Resolved';
};

const renderIssues = (issues) => {
  const tableBody = document.getElementById('adminIssues');
  const emptyState = document.getElementById('adminEmptyState');
  tableBody.innerHTML = '';

  if (issues.length === 0) {
    emptyState.textContent = 'No issues reported yet.';
    return;
  }
  emptyState.textContent = '';

  issues.forEach((issue, index) => {
    const tr = document.createElement('tr');
    tr.dataset.index = index;
    tr.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.studentName}</td>
      <td>${issue.title}</td>
      <td>${issue.category}</td>
      <td>${issue.description}</td>
      <td><span class="badge ${issue.status === 'Pending' ? 'pending' : issue.status === 'In Progress' ? 'progress' : 'resolved'}">${issue.status}</span></td>
      <td>
        <select class="priority-select">
          <option value="Low" ${issue.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${issue.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${issue.priority === 'High' ? 'selected' : ''}>High</option>
        </select>
      </td>
      <td>${issue.createdAt}</td>
      <td>
        <button class="btn secondary status-btn">${issue.status === 'Resolved' ? 'Resolved' : 'Move to ' + nextStatus(issue.status)}</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
};

const handleStatusChange = (rowIndex) => {
  const issues = getIssues();
  const issue = issues[rowIndex];
  if (!issue || issue.status === 'Resolved') return;
  issue.status = nextStatus(issue.status);
  saveIssues(issues);
  renderIssues(issues);
};

const handlePriorityChange = (rowIndex, newPriority) => {
  const issues = getIssues();
  const issue = issues[rowIndex];
  if (!issue) return;
  issue.priority = newPriority;
  saveIssues(issues);
};

const initAdminPage = () => {
  const user = requireAdmin();
  if (!user) return;

  renderIssues(getIssues());

  const table = document.getElementById('adminIssues');
  table.addEventListener('click', (event) => {
    if (event.target.classList.contains('status-btn')) {
      const row = event.target.closest('tr');
      const index = Number(row.dataset.index);
      handleStatusChange(index);
    }
  });

  table.addEventListener('change', (event) => {
    if (event.target.classList.contains('priority-select')) {
      const row = event.target.closest('tr');
      const index = Number(row.dataset.index);
      handlePriorityChange(index, event.target.value);
    }
  });

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);
};

document.addEventListener('DOMContentLoaded', initAdminPage);
