import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

function Login() {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const userData = isRegistering 
        ? { email, password, name, userType }
        : { email, password, userType };

      const response = await axios.post(`http://localhost:5000${endpoint}`, userData);

      if (response.data) {
        const { token, user } = response.data;
        login({ ...user, token });
        navigate(userType === 'student' ? '/student-dashboard' : '/faculty-dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-gradient"></div>
      </div>
      
      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" className="logo-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/>
            </svg>
            <h1>Academy Track</h1>
          </div>
          <p className="subtitle">Your Learning Journey Starts Here</p>
        </div>

        <div className="login-box">
          <div className="user-type-toggle">
            <button 
              className={`toggle-btn ${userType === 'student' ? 'active' : ''}`}
              onClick={() => setUserType('student')}
            >
              Student
            </button>
            <button 
              className={`toggle-btn ${userType === 'faculty' ? 'active' : ''}`}
              onClick={() => setUserType('faculty')}
            >
              Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="form-control"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              ) : (
                isRegistering ? 'Register' : 'Log In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <button 
              className="toggle-auth-mode" 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering 
                ? 'Already have an account? Log in' 
                : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
