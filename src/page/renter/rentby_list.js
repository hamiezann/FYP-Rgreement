import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/rentby.css"; // Custom styles
import useDocumentTitle from '../../utils/useDocumentTitles';
import { Modal, Button } from 'react-bootstrap';

const RentNearby = () => {
  const [rentHouses, setRentHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearestHouse, setNearestHouse] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showNearest, setShowNearest] = useState(false);
  const [showFarthest, setShowFarthest] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchPropertyId, setSearchPropertyId] = useState('');
  const navigate = useNavigate();
  useDocumentTitle('Rentby - Rgreement');

  useEffect(() => {
    const fetchRentHouses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nearby-house-list`);
        setRentHouses(response.data);
        // console.log('Response data:', response.data);
      } catch (error) {
        console.error("Error fetching rent houses:", error);
        setError(error);
      }
    };

    fetchRentHouses();
  }, []);

  useEffect(() => {
    if (navigator.geolocation && (showNearest || showFarthest)) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [showNearest, showFarthest]);

  const initialFilterOptions = {
    sortBy: "", // Options: "cheapest", "expensive"
    houseType: "" // Options: "apartment", "house", "condo", etc.
  };

  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    let filteredRentHouses = [...rentHouses];
  
    // Apply sorting logic
    if (filterOptions.sortBy === "cheapest") {
      filteredRentHouses.sort((a, b) => a.rent_fee - b.rent_fee);
    } else if (filterOptions.sortBy === "expensive") {
      filteredRentHouses.sort((a, b) => b.rent_fee - a.rent_fee);
    }
  
    // Apply filtering logic based on house type
    if (filterOptions.houseType) {
      filteredRentHouses = filteredRentHouses.filter(
        (house) => house.type_of_house === filterOptions.houseType
      );
    }
  
    // Arrange based on nearest or farthest
    if (showNearest || showFarthest) {
      filteredRentHouses.sort((a, b) => {
        if (userLocation) {
          const userLat = userLocation.latitude;
          const userLng = userLocation.longitude;
          const distanceA = calculateDistance(
            userLat,
            userLng,
            a.latitude,
            a.longitude
          );
          const distanceB = calculateDistance(
            userLat,
            userLng,
            b.latitude,
            b.longitude
          );
          return showNearest ? distanceA - distanceB : distanceB - distanceA;
        }
        return 0;
      });
    }
  
    if (showNearest && userLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
  
        let minDistance = Infinity;
        let nearestHouse = null;
  
        filteredRentHouses.forEach((house) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            house.latitude,
            house.longitude
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestHouse = house;
          }
        });
  
        setNearestHouse(nearestHouse);
      });
    }
  
    setRentHouses(filteredRentHouses);
  };
  
  const handleClearFilters = () => {
    setFilterOptions(initialFilterOptions);
    setShowNearest(false);
    setShowFarthest(false);
  };

  const handleChatOwner = (houseId, ownerId) => {
    navigate(`/chat/${houseId}`, { state: { ownerId: ownerId } });
  };

  const handleHouseDetails = (houseId) => {    
    const updateUrl = `/house-details/${houseId}`;
    navigate(updateUrl);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleShowNearestChange = () => {
    setShowNearest(true);
    setShowFarthest(false);
  };
  
  const handleShowFarthestChange = () => {
    setShowNearest(false);
    setShowFarthest(true);
  };

  const handleShowFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };
  
  const handleSearchPropertyIdChange = (e) => {
    setSearchPropertyId(e.target.value);
  };

  const handleSearchPropertyId = () => {
    const filteredHouses = rentHouses.filter(house => house.id === parseInt(searchPropertyId));
    setRentHouses(filteredHouses);
  }


  
  return (
    <div className="container mt-5">
      <div className="custom-block"></div>
      <h1>Discover your new rental home.</h1>
      <div className="button-row">
        <div className="search-bar-wrapper">
          <input
            type="text"
            id="property-search"
            placeholder="Enter Property ID..."
            value={searchPropertyId}
            onChange={handleSearchPropertyIdChange}
            className="property-search"
          />
        </div>
        <button className="filter-button" onClick={handleSearchPropertyId}>
          <i className="fas fa-search"></i>
        </button>
        <button className="filter-button" onClick={handleShowFilterModal}>Filter</button>
      </div>
      <div className="button-map">
        <button className="filter-button-map">
          <i className="fas fa-map"></i> See in Map
        </button>
      </div>
  
      <Modal show={showFilterModal} onHide={handleCloseFilterModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter Properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="filter-container mb-4">
            <h2>Rent Nearby</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="sortBy" className="form-label">Sort By:</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filterOptions.sortBy}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="expensive">Most Expensive</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="houseType" className="form-label">House Type:</label>
                <select
                  id="houseType"
                  name="houseType"
                  value={filterOptions.houseType}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="Flat">Flat</option>
                  <option value="Lot House">Lot House</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="showNearest"
                    name="showNearest"
                    checked={showNearest}
                    onChange={handleShowNearestChange}
                    className="form-check-input"
                  />
                  <label htmlFor="showNearest" className="form-check-label">Show Nearest</label>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="showFarthest"
                    name="showFarthest"
                    checked={showFarthest}
                    onChange={handleShowFarthestChange}
                    className="form-check-input"
                  />
                  <label htmlFor="showFarthest" className="form-check-label">Show Farthest</label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFilterModal}>Close</Button>
          <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="danger" onClick={handleClearFilters}>Clear Filters</Button>
        </Modal.Footer>
      </Modal>
  
      {rentHouses.length === 0 ? (
        <p>No rent houses found nearby.</p>
      ) : (
        <div class="container">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {rentHouses.map((house) => (
            <div key={house.id} className="col">
              <div className="card h-100 custom-card">
                {house.images && house.images.length > 0 ? (
                  <img src={house.images[0].url} className="card-img-top custom-img" alt="Property" />
                ) : (
                  <img src="/dummy.png" className="card-img-top custom-img" alt="Property" />
                )}
                {/* <div className="card-body custom-card-body"> */}
                <div className=" custom-card-body">
                  <h5 className="card-title custom-card-title">House No: {house.id}</h5>
                  <div className="rent-address">
                    {/* <i className="fas fa-location"></i> */}
                    <i class="fas fa-map-marker-alt"></i>
                    <p className="card-text custom-card-text"> {house.rent_address}</p>
                    {/* <p> {house.rent_address}</p> */}
                  </div>
                  <div className="custom-details">
                    <span><i className="fas fa-bed"></i> {house.num_bedrooms}</span>
                    <span><i className="fas fa-bath"></i> {house.num_toilets}</span>
                    <span><i className="fas fa-door-open"></i> {house.number_of_rooms}</span>
                    <span className="badge">FOR RENT</span>
                  </div>
                  <div className="rent-fee-container">
                    <p className="card-text custom-rent-fee">RM {house.rent_fee} per month</p>
                  </div>
                  {userLocation && (
                    <p className="card-text">
                      {calculateDistance(userLocation.latitude, userLocation.longitude, house.latitude, house.longitude)} km from you!
                    </p>
                  )}
                  <div className="button-container">
                    <button onClick={() => handleHouseDetails(house.id)} className="button-details">
                      <i className="fas fa-info-circle"></i> See Details
                    </button>
                    <button onClick={() => handleChatOwner(house.id, house.user_id)} className="button-chat">
                      <i className="fas fa-comments"></i> Chat Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
  
};

export default RentNearby;
