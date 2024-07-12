import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/profile.css';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false); // State to track hover state
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/profile`);
        const response = await axios.get(`${apiURL}/api/users/${userId}/profile`);
        setUserData(response.data.user); // Assuming API returns user data in 'user' key
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="profile-page">
      <div className="profile-top-spacer">
        {/* Balance information or other top spacer content */}
      </div>
      <div className="profile-details">
        <h1>My Profile</h1>
        {userData && userData.verified_member && (
          <div
            className="verified-icon"
            onMouseEnter={() => setHovered(true)} // Set hovered state to true on mouse enter
            onMouseLeave={() => setHovered(false)} // Set hovered state to false on mouse leave
          >
            <i className="fas fa-check"></i>
            {hovered && <span className="verified-text">VERIFIED</span>} {/* Show text when hovered */}
          </div>
        )}
        <div className="profile-content">
          {userData && (
            <div className="profile-pic">
              <img src={userData.profile_pic} alt={userData.name} />
              <h2>{userData.name}</h2>
              <p>{userData.email}<br />{userData.address}</p>
            </div>
          )}
          <div className="personal-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{userData ? userData.name : '-'}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span>{userData ? userData.role : '-'}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userData ? userData.email : '-'}</span>
            </div>
            <div className="info-item">
              <label>Email Verification:</label>
              <span className={userData && userData.email_verified_at ? 'active' : 'pending'}>
                {userData && userData.email_verified_at ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="info-item">
              <label>Career:</label>
              <span>{userData ? userData.career : '-'}</span>
            </div>
            <div className="info-item">
              <label>About Me:</label>
              <span>{userData ? userData.biography : '-'}</span>
            </div>
            <div className="info-item">
              <label>Age:</label>
              <span>{userData ? userData.age : '-'}</span>
            </div>
            <div className="info-item">
              <label>Income:</label>
              <span>RM {userData ? userData.income : '-'}</span>
            </div>
            {/* Add more info-items for other user data */}
          </div>
        </div>
      </div>
      <div className="navigation-tabs">
        <button className={isActive('/my-profile') ? 'active-tab' : ''} onClick={() => navigate('/my-profile')}>Profile</button>
        <button className={isActive('/edit-profile') ? 'active-tab' : ''} onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button className={isActive('/change-password') ? 'active-tab' : ''} onClick={() => navigate('/change-password')}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfilePage;
