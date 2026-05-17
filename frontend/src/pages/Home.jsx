import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light font-sans">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4 sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary-custom fs-4" to="/">
            <i className="bi bi-ui-checks-grid me-2"></i>TaskMaster
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium" href="#how-it-works">How It Works</a>
              </li>
            </ul>
            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <Link to="/login" className="btn btn-outline-primary px-4 rounded-pill fw-medium">Sign In</Link>
              <Link to="/signup" className="btn btn-primary px-4 rounded-pill fw-medium shadow-sm">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-5 text-center" style={{ background: 'linear-gradient(to bottom, #e0e7ff, #f8fafc)' }}>
        <div className="container py-5 my-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge bg-primary bg-opacity-10 text-primary-custom rounded-pill px-3 py-2 mb-4 fw-bold">
                Team Collaboration Made Easy
              </span>
              <h1 className="display-3 fw-bolder text-dark mb-4">
                Bring Your Team's Work <br />
                <span className="text-primary-custom">Into One Place</span>
              </h1>
              <p className="lead text-muted mb-5 px-md-5">
                TaskMaster is a modern, full-stack application designed to help teams organize projects, assign tasks, and track progress securely with role-based access control.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/signup" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-bold">
                  Start for Free
                </Link>
                <Link to="/login" className="btn btn-white bg-white text-dark btn-lg rounded-pill px-5 shadow-sm fw-bold border">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Website Details & Features</h2>
            <p className="text-muted">Everything you need to manage your workspace efficiently.</p>
          </div>
          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 card-hover-effect">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-folder-check fs-3 text-primary-custom"></i>
                </div>
                <h4 className="fw-bold">Project Workspaces</h4>
                <p className="text-muted">Create dedicated projects for different teams or goals. Keep all related tasks and team members organized in a single view.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 card-hover-effect">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-list-task fs-3 text-success"></i>
                </div>
                <h4 className="fw-bold">Task Delegation</h4>
                <p className="text-muted">Break projects down into actionable tasks. Assign them to specific members, set due dates, and monitor status updates.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 card-hover-effect">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-shield-check fs-3 text-warning"></i>
                </div>
                <h4 className="fw-bold">Secure Roles (Admin/Member)</h4>
                <p className="text-muted">Advanced JWT authentication ensures data security. Admins can manage everything, while Members only see what's assigned to them.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5 pb-3">
            <h2 className="fw-bold">How TaskMaster Works</h2>
            <p className="text-muted">A simple, 4-step workflow to boost your team's productivity.</p>
          </div>
          
          <div className="row g-4 position-relative">
            {/* Connecting Line for Desktop */}
            <div className="d-none d-lg-block position-absolute top-50 start-0 w-100 border-top border-2 border-primary border-opacity-25" style={{ zIndex: 0 }}></div>
            
            <div className="col-12 col-md-6 col-lg-3 position-relative" style={{ zIndex: 1 }}>
              <div className="card text-center border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-4 fw-bold shadow" style={{ width: '50px', height: '50px' }}>1</div>
                <h5 className="fw-bold">Sign Up</h5>
                <p className="text-muted small mb-0">Create your secure account. Admins can instantly set up the workspace.</p>
              </div>
            </div>
            
            <div className="col-12 col-md-6 col-lg-3 position-relative" style={{ zIndex: 1 }}>
              <div className="card text-center border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-4 fw-bold shadow" style={{ width: '50px', height: '50px' }}>2</div>
                <h5 className="fw-bold">Create Projects</h5>
                <p className="text-muted small mb-0">Set up a project dashboard and invite your team members to join.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 position-relative" style={{ zIndex: 1 }}>
              <div className="card text-center border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-4 fw-bold shadow" style={{ width: '50px', height: '50px' }}>3</div>
                <h5 className="fw-bold">Assign Tasks</h5>
                <p className="text-muted small mb-0">Distribute the workload by assigning specific tasks to your team.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 position-relative" style={{ zIndex: 1 }}>
              <div className="card text-center border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-4 fw-bold shadow" style={{ width: '50px', height: '50px' }}>4</div>
                <h5 className="fw-bold">Track & Complete</h5>
                <p className="text-muted small mb-0">Members update task status in real-time, driving projects to completion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-5 bg-primary-custom text-white text-center">
        <div className="container py-5">
          <h2 className="fw-bolder mb-4">Ready to organize your team?</h2>
          <p className="lead mb-5 opacity-75">Join thousands of users who are already managing their tasks better.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary-custom shadow">
              Create an Account
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <div className="container">
          <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
