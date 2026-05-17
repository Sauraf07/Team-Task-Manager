import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser()?.user;
  const isAdmin = currentUser?.role === 'Admin';

  const fetchUsers = async () => {
    try {
      const usersData = await authService.getAllUsers();
      setMembers(usersData);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName}?`)) return;

    try {
      await authService.deleteUser(userId);
      toast.success(`${userName} removed successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Team Directory</h2>
          <p className="text-muted small">View all registered members in the workspace.</p>
        </div>
      </div>

      <div className="row">
        {members.map((member) => (
          <div className="col-md-6 col-lg-3 mb-4" key={member.id}>
            <div className="card text-center p-4 border-0 shadow-sm h-100 rounded-4 card-hover-effect">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <i className="bi bi-person-circle text-primary opacity-75" style={{ fontSize: '4.5rem' }}></i>
                {member.role === 'Admin' && (
                  <span className="position-absolute bottom-0 end-0 bg-warning text-dark border border-white rounded-circle p-1" title="Admin">
                    <i className="bi bi-star-fill" style={{ fontSize: '0.8rem' }}></i>
                  </span>
                )}
              </div>
              
              <h5 className="fw-bold mb-1 text-dark">{member.name}</h5>
              <p className="text-muted small mb-3">{member.email}</p>
              
              <div className="d-flex justify-content-center bg-light rounded p-2 mb-3">
                <div className="text-center w-100">
                  <small className="d-block text-muted">Role</small>
                  <span className={`badge ${member.role === 'Admin' ? 'bg-danger text-white' : 'bg-secondary text-white'}`}>
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <button className="btn btn-outline-primary btn-sm rounded-pill w-100 mb-2" onClick={() => toast.info(`${member.name}'s Profile (${member.email})`)}>
                  View Profile
                </button>
                {isAdmin && currentUser?.id !== member.id && (
                  <button 
                    className="btn btn-outline-danger btn-sm rounded-pill w-100" 
                    onClick={() => handleRemoveUser(member.id, member.name)}
                  >
                    <i className="bi bi-person-x"></i> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
