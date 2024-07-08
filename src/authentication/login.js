import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import '../style/authentication.css'; // Import your custom CSS file
import useDocumentTitle from '../utils/useDocumentTitles';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useDocumentTitle('Auth - Login');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access_token;
      const role = data.role;
      const userId = data.userId;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);

      window.location.reload();
      navigate('/home');
    } else {
      alert('Login Unsuccessful. Please check your email and password.');
    }
  };

  return (
    <div className="main-container">
      <div className="authentication-container">
        <div className="card-body-authentication">
          <h2 className="card-title text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn custom-btn w-100">Login</button>
            </div>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
