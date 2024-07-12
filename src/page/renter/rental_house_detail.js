import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "../../style/renter/rental_house_detail.css";
import "leaflet/dist/leaflet.css";
import useDocumentTitle from '../../utils/useDocumentTitles';

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const [houseDetails, setHouseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;
  
  useDocumentTitle('Product Details - Rgreement');

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        const response = await axios.get(`${apiURL}/api/house-details/${houseId}`);
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

  const position = [houseDetails.latitude, houseDetails.longitude];

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
          </ul>
          <div className="actions">
            <button className="chat-now-button">Chat Now</button>
            <button className="apply-button" onClick={() => handleApplyNow(houseId)}>Apply</button>
          </div>
        </div>

        {/* Map Section */}
        
        <div className="map-section">
        <h5>LOCATION</h5>
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="map-container">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={L.icon({ iconUrl:  `${process.env.PUBLIC_URL}/marker.png`, iconSize: [25, 25], iconAnchor: [12, 41] })}>
              <Popup>
                {houseDetails.rent_address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HouseDetailPage;
