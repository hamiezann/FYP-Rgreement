import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/profile.css';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    career: '',
    biography: '',
    age: '',
    income: '',
    phone_number: '',
    profile_pic: ''
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;


  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/profile`);
        const response = await axios.get(`${apiURL}/api/users/${userId}/profile`);
        setUserData(response.data.user); // Assuming API returns user data in 'user' key
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUserData({ ...userData, profile_pic: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    if (profilePicFile) {
      formData.append('profile_pic', profilePicFile);
    }

    try {
      // await axios.post(`http://127.0.0.1:8000/api/users/${userId}/edit-profile`, formData, {
      await axios.post(`${apiURL}/api/users/${userId}/edit-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-top-spacer">
        {/* Balance information or other top spacer content */}
      </div>
      <div className="profile-details">
        <h1>Edit Profile</h1>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="info-item">
            <label>Name:</label>
            <input type="text" name="name" value={userData.name} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Career:</label>
            <input type="text" name="career" value={userData.career} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Address:</label>
            <input type="text" name="address" value={userData.address} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>About Me:</label>
            <textarea name="biography" value={userData.biography} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Phone Number:</label>
            <input type="text" name="phone_number" value={userData.phone_number} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Upload Profile Pic:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          {userData.profile_pic && (
            <div className="info-item">
              <label>Profile Picture:</label>
              <img src={userData.profile_pic} alt="Profile" style={{ width: '100px', height: '100px' }} />
            </div>
          )}
          <div className="info-item">
            <label>Age:</label>
            <input type="number" name="age" value={userData.age} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Income:</label>
            <input type="text" name="income" value={userData.income} onChange={handleChange} />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div className="navigation-tabs">
        <button onClick={() => navigate('/my-profile')}>Profile</button>
        <button className="active-tab" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button onClick={() => navigate('/change-password')}>Change Password</button>
      </div>
    </div>
  );
};

export default EditProfilePage;
