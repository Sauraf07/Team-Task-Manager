import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    // Frontend Validations
    if (!name || !email || !password || !role) {
      return toast.warning('Please fill in all fields');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.warning('Please enter a valid email address');
    }

    if (password.length < 6) {
      return toast.warning('Password must be at least 6 characters long');
    }

    try {
      await authService.signup(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      // Error toast is automatically handled by the Axios interceptor
      console.error('Signup Failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4 text-primary-custom fw-bold">Sign Up</h2>
            <form onSubmit={handleSignup}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" name="email" className="form-control" placeholder="name@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              </div>
              <div className="mb-4">
                <label className="form-label">Account Role</label>
                <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                  <option value="Member">Member (Employee)</option>
                  <option value="Admin">Admin (Manager)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">Create Account</button>
            </form>
            <div className="text-center mt-3">
              <span>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
