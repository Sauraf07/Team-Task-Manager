# TaskMaster - Enterprise Team Task Manager 🚀

TaskMaster is a modern, full-stack, enterprise-grade team collaboration and project management application. Built to help teams organize projects, assign tasks, track progress, and communicate in real-time. It features a robust Role-Based Access Control (RBAC) system to differentiate between Management (Admins) and Employees (Members).

![TaskMaster Overview](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

## ✨ Key Features

- **🔐 Role-Based Access Control (RBAC)**
  - **Admins:** Full control. Can create projects, assign tasks, delete tasks, and view global company metrics.
  - **Members:** Focused view. Can only view projects they are assigned to, view their specific tasks, and update the status of their assigned work.
- **📊 Dynamic Dashboard Analytics**
  - Server-calculated metrics displaying Total Projects, Total Tasks, Completed Tasks, and Overdue Tasks.
  - Visual progress bars for instant status tracking.
- **📁 Project & Task Management**
  - Many-to-Many relational database structure mapping Users to Projects.
  - Create tasks with Priorities (Low, Medium, High, Critical) and Due Dates.
- **💬 Real-Time Collaboration**
  - Built-in commenting system. Team members can chat within specific tasks to maintain an activity log and collaborate efficiently.
- **🔍 Advanced Search & Filters**
  - Live text search across all tasks.
  - Multi-layered filtering by Status and Priority.

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Bootstrap 5 & Bootstrap Icons (Custom themed)
- Axios (API requests & Interceptors)
- React Router DOM (Protected Routes)
- React Toastify (Notifications)

**Backend:**
- Node.js & Express.js
- MySQL (Relational Database)
- Sequelize ORM (Database modeling & auto-sync)
- JSON Web Tokens (JWT) (Secure Authentication)
- bcryptjs (Password Hashing)

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- **Node.js** installed on your machine.
- **MySQL Server** installed and running locally.

### 2. Database Setup
Log into your MySQL server and create an empty database for the application:
```sql
CREATE DATABASE taskmanager;
```

### 3. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Create a `.env` file in the `backend` folder and add the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=taskmanager
JWT_SECRET=your_super_secret_jwt_key_123
```
*(Replace `your_mysql_password` with your actual MySQL password).*

Start the backend server:
```bash
npm run dev
```
*(Sequelize will automatically sync the models and create the necessary tables in your database).*

### 4. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 5. Access the Application
Open your browser and navigate to: **`http://localhost:5173`**

---

## 📖 Usage Instructions

1. **First Login:** Navigate to the Signup page. Create your first user account.
2. **Select Role:** During signup, select the **Admin (Manager)** role to gain full access to the application.
3. **Create Workspace:** Go to the Projects tab and create your first project.
4. **Invite Team:** Have your teammates sign up as **Members (Employees)**.
5. **Assign Work:** Go to the Tasks tab, click "Add Task", and assign it to a team member within your project.
6. **Collaborate:** Click the chat icon on any task to open the details view and start commenting!

---

## 🏗️ Architecture & Database Flow
- **Users Table:** Stores credentials, hashed passwords, and Roles (Admin/Member).
- **Projects Table:** Stores project details and links to the creator.
- **ProjectMembers Table:** Junction table handling the Many-to-Many relationship between Users and Projects.
- **Tasks Table:** Stores task metadata, links to a Project, links to an Assignee (User), and tracks Priority/Status.
- **Comments Table:** Stores text messages, linking them to a specific Task and the User who wrote it.

---
*Built with ❤️ as a modern, full-stack portfolio project.*
