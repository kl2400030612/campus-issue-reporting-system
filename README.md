# Campus Issue Reporting System

A beginner-friendly, front-end-only web app that lets students submit campus issues and admins manage them. All data lives in the browser via LocalStorage—no backend required.

## Features
- Register/Login with role selection (Student/Admin)
- Student dashboard to submit issues with title, category, and description
- Admin dashboard to view all issues, set priority (Low/Medium/High), and move status (Pending → In Progress → Resolved)
- Status and priority badges for quick scanning
- Simple role-based page guard to prevent unauthorized access

## Tech Stack
- HTML
- CSS
- Vanilla JavaScript
- Browser LocalStorage

## Getting Started
1. Open `index.html` in your browser (double-click or use a local web server).
2. Register a user with a chosen role (Student or Admin).
3. Log in with the same credentials and selected role.
4. Students are redirected to `student.html`; admins to `admin.html`.

## How Roles Work
- **Student**: Can submit new issues and view only their own submissions with statuses and priorities.
- **Admin**: Can see all issues, update status through each stage, and assign priority levels.

## Notes
- Passwords are lightly obfuscated before storage but not secure—suitable only for learning/demo purposes.
- Clearing browser storage will remove all accounts and issues.
"# campus-issue-reporting-system" 
