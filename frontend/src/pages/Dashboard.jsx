import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import dashboardService from '../services/dashboardService';
import authService from '../services/authService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = authService.getCurrentUser()?.user;

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardStats();

      setStats({
        totalProjects: data.totalProjects,
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        pendingTasks: data.pendingTasks,
        inProgressTasks: data.inProgressTasks,
        overdueTasks: data.overdueTasks,
      });

      setRecentTasks(data.recentTasks);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const completedPercent = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const inProgressPercent = stats.totalTasks > 0 ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0;
  const pendingPercent = stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0;

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Welcome back, {user?.name}!</h2>
          <p className="text-muted small">Here is your dashboard overview.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>
      
      {/* Metrics Cards */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center p-4 border-primary border-bottom border-3 shadow-sm card-hover-effect rounded-4">
            <div className="mb-2"><i className="bi bi-folder-fill text-primary fs-1"></i></div>
            <h5 className="text-muted mb-1">Projects</h5>
            <h2 className="text-dark fw-bold mb-0">{stats.totalProjects}</h2>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center p-4 border-info border-bottom border-3 shadow-sm card-hover-effect rounded-4">
            <div className="mb-2"><i className="bi bi-list-task text-info fs-1"></i></div>
            <h5 className="text-muted mb-1">Total Tasks</h5>
            <h2 className="text-dark fw-bold mb-0">{stats.totalTasks}</h2>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center p-4 border-success border-bottom border-3 shadow-sm card-hover-effect rounded-4">
            <div className="mb-2"><i className="bi bi-check-circle-fill text-success fs-1"></i></div>
            <h5 className="text-muted mb-1">Completed</h5>
            <h2 className="text-dark fw-bold mb-0">{stats.completedTasks}</h2>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center p-4 border-warning border-bottom border-3 shadow-sm card-hover-effect rounded-4">
            <div className="mb-2"><i className="bi bi-clock-history text-warning fs-1"></i></div>
            <h5 className="text-muted mb-1">Pending</h5>
            <h2 className="text-dark fw-bold mb-0">{stats.pendingTasks}</h2>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center p-4 border-danger border-bottom border-3 shadow-sm card-hover-effect rounded-4">
            <div className="mb-2"><i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i></div>
            <h5 className="text-muted mb-1">Overdue</h5>
            <h2 className="text-dark fw-bold mb-0">{stats.overdueTasks}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Progress Bar Section */}
        <div className="col-lg-6 mb-4">
          <div className="card p-4 h-100 border-0 shadow-sm rounded-4">
            <h5 className="fw-bold mb-4">Task Completion Status</h5>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span>Completed</span>
                <span className="fw-bold text-success">{completedPercent}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${completedPercent}%` }}></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span>In Progress</span>
                <span className="fw-bold text-warning">{inProgressPercent}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${inProgressPercent}%` }}></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span>Pending</span>
                <span className="fw-bold text-secondary">{pendingPercent}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: `${pendingPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks List */}
        <div className="col-lg-6 mb-4">
          <div className="card p-4 h-100 border-0 shadow-sm rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Tasks</h5>
            </div>
            {recentTasks.length === 0 ? (
              <p className="text-muted">No tasks available.</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentTasks.map((task) => (
                  <div key={task.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div>
                      <h6 className="mb-1">{task.title}</h6>
                      <small className="text-muted">{task.project?.name || 'No Project'}</small>
                    </div>
                    <span className={`badge rounded-pill ${task.status === 'Completed' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
