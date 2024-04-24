import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/authentication.css'; // Import your CSS file

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Send login data to your backend API for authentication
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      // Handle successful login (e.g., redirect to dashboard)
      // Parse the response JSON to extract the access_token
      const data = await response.json();
      const accessToken = data.access_token;
  
      // Store the access_token in local storage
      localStorage.setItem('access_token', accessToken);
      // Reload the page to trigger rendering of authenticated content
      window.location.reload();
    } else {
      // Handle login errors (e.g., display error message)
      alert('Login Unsuccessful. Please check your email and password.');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className="btn-login">Login</button>
      </form>
      <p>
        Don't have an account? <Link to='/register'>Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
