import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../../style/renter/rental_house_detail.css";

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const [houseDetails, setHouseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        console.log('Response data:', response.data);
        setHouseDetails(response.data[0]); // Accessing the first element
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching house details:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !houseDetails) {
    return <div className="alert alert-danger" role="alert">Error: Failed to fetch house details</div>;
  }

  const handleApplyNow = (houseId) => {
    navigate(`/apply-house/${houseId}`);
  };

  return (
    <div className="house-detail-container">
      <div className='top-spacer'></div>
      <div className="image-section">
        <img src={houseDetails.images[0].url} alt="Property" className="house-image" />
      </div>
      
      <div className="details-section">
        <span className="badge">FOR RENT</span>
        <div className="header-container">
          <div className='header-start-product'>
            <h1>House Details</h1>
            <p>{houseDetails.rent_address}</p>
          </div>
          <div className="vertical-line"></div>
          <div className='header-end-product'>
            <p><strong>{houseDetails.number_of_rooms}</strong> Rooms</p>
            <p><strong>{houseDetails.num_bedrooms}</strong> Bedrooms</p>
            <p><strong>{houseDetails.num_toilets}</strong> Toilets</p>
          </div>
        </div>
    <div className='description-class'>
        <p className="category">RENTAL HOUSE | ⭐⭐⭐⭐⭐ 4.9 (2130 reviews)</p>
        <h5>ABOUT THIS PROPERTY</h5>
        <p className='description'>{houseDetails.description}</p>
        <h5>PROPERTY FEATURES</h5>
        <p className='description'>{houseDetails.amenities}</p>
        <ul className="features">
          <li>Rent Fee: RM{houseDetails.rent_fee}</li>
          <li>Preferred Occupants: {houseDetails.prefered_occupants}</li>
          <li>Type of House: {houseDetails.type_of_house}</li>
          {/* <li>Amenities: {houseDetails.amenities}</li>
          <li>Number of Rooms: {houseDetails.number_of_rooms}</li>
          <li>Number of Bedrooms: {houseDetails.num_bedrooms}</li>
          <li>Number of Toilet: {houseDetails.num_toilets}</li> */}
        </ul>
        <div className="actions">
          <button className="chat-now-button">Chat Now</button>
          <button className="apply-button" onClick={() => handleApplyNow(houseId)}>Apply</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HouseDetailPage;
