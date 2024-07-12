import React, { useState } from 'react';
import axios from 'axios';
import '../style/profile.css';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;


  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      setLoading(false);
      return;
    }

    try {
      // await axios.post(`http://127.0.0.1:8000/api/users/${userId}/change-password`, {
      await axios.post(`${apiURL}/api/users/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });
      setSuccessMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="profile-page">
      <div className="profile-top-spacer">
        {/* Balance information or other top spacer content */}
      </div>
      <div className="profile-details">
        <h1>Change Password</h1>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleChangePassword}>
          <div className="info-item">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="info-item">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="info-item">
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
      <div className="navigation-tabs">
        <button className={isActive('/my-profile') ? 'active-tab' : ''} onClick={() => navigate('/my-profile')}>
          Profile
        </button>
        <button className={isActive('/edit-profile') ? 'active-tab' : ''} onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </button>
        <button className={isActive('/change-password') ? 'active-tab' : ''} onClick={() => navigate('/change-password')}>
          Change Password
        </button>

        {/* <button onClick={() => navigate('/my-profile')}>Profile</button>
        <button className="active-tab" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button onClick={() => navigate('/reset-password')}>Reset Password</button> */}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
