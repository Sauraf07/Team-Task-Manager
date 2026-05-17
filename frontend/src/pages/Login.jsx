import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Frontend Validations
    if (!email || !password) {
      return toast.warning('Please fill in all fields');
    }

    try {
      await authService.login(formData);
      toast.success('Login successful!');
      // Force reload to update ProtectedRoute state if we were relying on context, 
      // but for now redirecting to dashboard works
      navigate('/dashboard');
      window.location.reload(); 
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4 text-primary-custom fw-bold">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" name="email" className="form-control" placeholder="name@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <div className="text-center mt-3">
              <span>Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
