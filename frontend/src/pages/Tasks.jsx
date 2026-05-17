import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import authService from '../services/authService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // For Details/Comments Modal
  const [commentText, setCommentText] = useState('');
  
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', projectId: '', assignedTo: '', priority: 'Medium' });
  
  const currentUser = authService.getCurrentUser()?.user;
  const isAdmin = currentUser?.role === 'Admin';

  const fetchData = async () => {
    try {
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
      
      const projs = await projectService.getProjects();
      setProjects(projs);
      const usrs = await authService.getAllUsers();
      setUsers(usrs);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId || !formData.assignedTo) {
      return toast.warning('Title, Project, and Assignee are required');
    }
    
    try {
      await taskService.createTask(formData);
      toast.success('Task created successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', description: '', dueDate: '', projectId: '', assignedTo: '', priority: 'Medium' });
      fetchData(); // Refresh tasks
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const newComment = await taskService.addCommentToTask(selectedTask.id, commentText);
      // Optimistically update the selected task's comments in UI
      const updatedTask = { ...selectedTask, comments: [...(selectedTask.comments || []), newComment] };
      setSelectedTask(updatedTask);
      setCommentText('');
      fetchData(); // Refresh the main task list silently
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'text-success bg-success bg-opacity-10';
      case 'In Progress': return 'text-primary bg-primary bg-opacity-10';
      default: return 'text-secondary bg-secondary bg-opacity-10';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-danger text-white';
      case 'High': return 'bg-warning text-dark';
      case 'Medium': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Task Board</h2>
          <p className="text-muted small">Manage, filter, and collaborate on your tasks.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary shadow-sm rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>Add Task
          </button>
        )}
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-flex flex-wrap gap-3 align-items-center border">
        <div className="flex-grow-1 min-w-200">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0 ps-0" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-5 mt-4 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-list-check text-muted mb-3" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold text-dark">No tasks available</h4>
          <p className="text-muted">You have a clean slate! Enjoy your day.</p>
          {isAdmin && (
             <button className="btn btn-primary mt-2 rounded-pill px-4" onClick={() => setShowCreateModal(true)}>Create a new task</button>
          )}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-4 text-muted fw-semibold">Task Name</th>
                    <th className="py-3 text-muted fw-semibold">Project</th>
                    <th className="py-3 text-muted fw-semibold">Assignee</th>
                    <th className="py-3 text-muted fw-semibold">Priority</th>
                    <th className="py-3 text-muted fw-semibold">Status</th>
                    <th className="py-3 text-muted fw-semibold">Due Date</th>
                    <th className="py-3 px-4 text-end text-muted fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-4 py-3 fw-bold text-dark">
                        {task.title}
                        {task.comments?.length > 0 && (
                          <span className="ms-2 text-muted small"><i className="bi bi-chat-dots-fill"></i> {task.comments.length}</span>
                        )}
                      </td>
                      <td className="py-3 text-muted">{task.project?.name || 'N/A'}</td>
                      <td className="py-3 text-muted">{task.assignee?.name || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`badge ${getPriorityBadge(task.priority)} rounded-pill`}>{task.priority}</span>
                      </td>
                      <td className="py-3">
                        <select 
                          className={`form-select form-select-sm badge ${getStatusBadge(task.status)} border-0 fw-bold`} 
                          style={{ width: 'auto', cursor: 'pointer', appearance: 'none' }}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <option value="Pending" className="text-dark bg-white">Pending</option>
                          <option value="In Progress" className="text-dark bg-white">In Progress</option>
                          <option value="Completed" className="text-dark bg-white">Completed</option>
                        </select>
                      </td>
                      <td className="py-3 text-muted">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
                      <td className="px-4 py-3 text-end text-nowrap">
                        <button onClick={() => setSelectedTask(task)} className="btn btn-sm btn-light text-primary rounded-circle p-2 me-2" title="View & Comment">
                          <i className="bi bi-chat-right-text-fill"></i>
                        </button>
                        {isAdmin && (
                          <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-light text-danger rounded-circle p-2" title="Delete">
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">No tasks match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">Create New Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleCreateSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Task Title *</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Description</label>
                    <textarea name="description" className="form-control" rows="2" value={formData.description} onChange={handleChange}></textarea>
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label fw-medium">Project *</label>
                      <select name="projectId" className="form-select" value={formData.projectId} onChange={handleChange} required>
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium">Assign To *</label>
                      <select name="assignedTo" className="form-select" value={formData.assignedTo} onChange={handleChange} required>
                        <option value="">Select User</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label fw-medium">Due Date</label>
                      <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium">Priority</label>
                      <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light fw-medium px-4" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary fw-medium px-4">Create Task</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details & Comments Modal */}
      {selectedTask && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="row g-0">
                {/* Left Side: Task Info */}
                <div className="col-md-5 bg-light p-4 border-end">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge ${getStatusBadge(selectedTask.status)} rounded-pill`}>{selectedTask.status}</span>
                    <button type="button" className="btn-close d-md-none" onClick={() => setSelectedTask(null)}></button>
                  </div>
                  <h4 className="fw-bold mb-1">{selectedTask.title}</h4>
                  <p className="text-muted small mb-4">Project: <span className="fw-semibold text-dark">{selectedTask.project?.name}</span></p>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-muted text-uppercase small">Description</h6>
                    <p className="bg-white p-3 rounded-3 border small shadow-sm">{selectedTask.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center me-3" style={{width:'40px', height:'40px'}}><i className="bi bi-person text-primary"></i></div>
                      <div><small className="text-muted d-block">Assignee</small><span className="fw-semibold">{selectedTask.assignee?.name}</span></div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center me-3" style={{width:'40px', height:'40px'}}><i className="bi bi-calendar-event text-danger"></i></div>
                      <div><small className="text-muted d-block">Due Date</small><span className="fw-semibold">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'None'}</span></div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center me-3" style={{width:'40px', height:'40px'}}><i className="bi bi-flag text-warning"></i></div>
                      <div><small className="text-muted d-block">Priority</small><span className="fw-semibold">{selectedTask.priority}</span></div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Comments */}
                <div className="col-md-7 p-0 d-flex flex-column" style={{ height: '600px' }}>
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h6 className="fw-bold mb-0"><i className="bi bi-chat-square-text me-2 text-primary-custom"></i>Activity & Comments</h6>
                    <button type="button" className="btn-close d-none d-md-block" onClick={() => setSelectedTask(null)}></button>
                  </div>
                  
                  <div className="flex-grow-1 p-4 overflow-auto bg-white" style={{ maxHeight: '450px' }}>
                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                      selectedTask.comments.map(c => (
                        <div key={c.id} className={`d-flex mb-4 ${c.userId === currentUser.id ? 'justify-content-end' : ''}`}>
                          <div className={`p-3 rounded-4 shadow-sm ${c.userId === currentUser.id ? 'bg-primary-custom text-white' : 'bg-light'}`} style={{ maxWidth: '85%' }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className={`fw-bold ${c.userId === currentUser.id ? 'text-white' : 'text-dark'}`}>{c.user?.name}</small>
                              <small className={`ms-3 ${c.userId === currentUser.id ? 'text-white-50' : 'text-muted'}`} style={{fontSize: '0.7rem'}}>{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                            </div>
                            <p className="mb-0 small">{c.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted opacity-50">
                        <i className="bi bi-chat-square-dots fs-1 mb-2"></i>
                        <p>No comments yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-light border-top mt-auto">
                    <form onSubmit={handleAddComment}>
                      <div className="input-group">
                        <input type="text" className="form-control border-0 shadow-sm rounded-start-pill ps-4 py-2" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                        <button className="btn btn-primary shadow-sm rounded-end-pill px-4" type="submit" disabled={!commentText.trim()}>
                          <i className="bi bi-send-fill"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
