import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active bg-primary-custom text-white' : 'text-dark';
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar shadow-sm p-3">
        <h4 className="text-primary-custom fw-bold mb-4 text-center mt-2">
          <i className="bi bi-ui-checks-grid me-2"></i>TaskMaster
        </h4>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <Link to="/dashboard" className={`nav-link rounded ${isActive('/dashboard')}`}>
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className={`nav-link rounded ${isActive('/projects')}`}>
              <i className="bi bi-folder me-2"></i> Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tasks" className={`nav-link rounded ${isActive('/tasks')}`}>
              <i className="bi bi-list-task me-2"></i> Tasks
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/team" className={`nav-link rounded ${isActive('/team')}`}>
              <i className="bi bi-people me-2"></i> Team
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-4 w-100 position-absolute bottom-0 start-0 p-3">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content w-100">
        {/* Top Navbar */}
        <div className="top-navbar d-flex justify-content-between">
          <div>
            {/* Mobile toggle button placeholder */}
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3 text-end">
              <div className="fw-bold">{user?.name || 'User'}</div>
              <small className="text-muted">{user?.email || 'user@example.com'}</small>
            </div>
            <i className="bi bi-person-circle fs-3 text-secondary"></i>
          </div>
        </div>

        {/* Page Content */}
        <div className="content-wrapper">
          <Outlet /> {/* This is where the page components render */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
