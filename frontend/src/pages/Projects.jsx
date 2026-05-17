import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import projectService from '../services/projectService';
import authService from '../services/authService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '' });
  
  const user = authService.getCurrentUser()?.user;
  const isAdmin = user?.role === 'Admin';

  const handleUpdateStatus = async (projectId, currentStatus) => {
    // Cycle statuses: Active -> Completed -> On Hold -> Active
    const statuses = ['Active', 'Completed', 'On Hold'];
    const currentIndex = statuses.indexOf(currentStatus);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];
    
    try {
      await projectService.updateProjectStatus(projectId, newStatus);
      toast.success(`Project marked as ${newStatus}`);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleDeleteProject = async (projectId, status) => {
    if (status !== 'Completed') {
      return toast.warning('Only completed projects can be deleted');
    }

    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.warning('Project name is required');
    
    try {
      await projectService.createProject(formData);
      toast.success('Project created successfully!');
      setShowModal(false);
      setFormData({ name: '', description: '', dueDate: '' });
      fetchProjects(); // Refresh list
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'bg-primary';
    if (status === 'Completed') return 'bg-success';
    return 'bg-warning text-dark';
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Projects</h2>
          <p className="text-muted small">Manage your team's ongoing projects.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary shadow-sm rounded-pill px-4" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-5 mt-5 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-folder-x text-muted mb-3" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold text-dark">No projects found</h4>
          <p className="text-muted">You are not assigned to any projects yet.</p>
          {isAdmin && (
             <button className="btn btn-primary mt-2 rounded-pill px-4" onClick={() => setShowModal(true)}>Create your first project</button>
          )}
        </div>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-6 col-lg-4 mb-4" key={project.id}>
              <div className="card h-100 p-4 border-0 shadow-sm position-relative card-hover-effect">
                <span className={`position-absolute top-0 end-0 mt-3 me-3 badge ${getStatusBadge(project.status)} rounded-pill`}>
                  {project.status}
                </span>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded p-3 me-3 text-primary-custom">
                    <i className="bi bi-folder2-open fs-3"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{project.name}</h5>
                    {project.dueDate && <small className="text-muted">Due: {new Date(project.dueDate).toLocaleDateString()}</small>}
                  </div>
                </div>
                
                <p className="text-muted flex-grow-1">{project.description || 'No description provided.'}</p>
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-people-fill text-secondary me-2 fs-5"></i>
                    <small className="text-muted fw-bold">{project.members ? project.members.length : 0} members</small>
                  </div>
                  <div className="d-flex gap-2">
                    {isAdmin && (
                      <>
                        <button 
                          className="btn btn-sm btn-outline-success rounded-pill px-3" 
                          onClick={() => handleUpdateStatus(project.id, project.status)}
                          title="Change Status"
                        >
                          <i className="bi bi-arrow-repeat"></i> Status
                        </button>
                        {project.status === 'Completed' && (
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-3" 
                            onClick={() => handleDeleteProject(project.id, project.status)}
                            title="Delete Project"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </>
                    )}
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => toast.info(`Details: ${project.description || 'No description provided'}`)}>Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal (Manual implementation to avoid bootstrap JS issues) */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">Create New Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Project Name *</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. Website Redesign" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Description</label>
                    <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} placeholder="Project goals and details..."></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Due Date</label>
                    <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light fw-medium px-4" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary fw-medium px-4">Create Project</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
