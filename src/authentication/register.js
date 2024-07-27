import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import '../style/authentication.css'; // Import your custom CSS file
import useDocumentTitle from '../utils/useDocumentTitles';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('renter'); // Default to 'renter'
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;
  useDocumentTitle('Auth - Register');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const response = await fetch('http://127.0.0.1:8000/api/register', {
    const response = await fetch(`${apiURL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      navigate('/login');
    } else {
      alert('Registration Unsuccessful. Please try again.');
    }
  };

  return (
    <div className="main-container">
      <div className="authentication-container">
        <div className="card-body-authentication">
          <h2 className="card-title text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="renter">Renter</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn custom-btn w-100">Register</button>
            </div>
          </form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
