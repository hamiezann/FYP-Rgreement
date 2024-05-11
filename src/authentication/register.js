import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/authentication.css'; // Import your CSS file

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Role:", role);
    // Send registration data to your backend API for user creation
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      // Handle successful registration (e.g., redirect to login page)
      const data = await response.json();
      alert(data.message);
     navigate('/login');

    } else {
      // Handle registration errors (e.g., display error message)
      alert('Registration Unsuccessful. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
      {/* Dropdown menu for selecting role */}
      <label htmlFor='role'>Role:</label>
      <select id='role' value={role} onChange={(e) => setRole(e.target.value)}>
        <option value='renter'>Renter</option>
        <option value='landlord'>Landlord</option>
      </select>
        </div>
        <button type="submit" className="btn-register">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
