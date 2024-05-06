import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/rentby.css";

// import { lazy, Suspense } from "react";
// import NearestHouse from "./nearest_house";

const RentNearby = () => {
  const [rentHouses, setRentHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [nearestHouse, setNearestHouse] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showNearest, setShowNearest] = useState(false);
  const [showFarthest, setShowFarthest] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const fetchRentHouses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nearby-house-list`);
        setRentHouses(response.data);
        // setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rent houses:", error);
        setError(error);
        // setIsLoading(false);
      }
    };

    fetchRentHouses();
  }, []);

  useEffect(() => {
   // if (navigator.geolocation && (showNearest || showFarthest)) {
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
        // Check if userLocation is not null before accessing its properties
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
        // Return 0 if userLocation is null
        return 0;
      });
    }
  
    // Calculate nearest house only if "Show Nearest" is checked
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
  //  const ownerName = houseData.find((house) => house.id === houseId)?.owner?.name;
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

  const sortByDistance = (a, b) => {
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;
    const distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
    const distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
    return distanceA - distanceB;
  };

  const handleShowNearestChange = () => {
    setShowNearest(true);
    setShowFarthest(false);
  };
  
  const handleShowFarthestChange = () => {
    setShowNearest(false);
    setShowFarthest(true);
  };
  

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  return (
    <div>
      {/* Filter Section */}
      <div className="filter-container">
        <h2>Rent Nearby</h2>
        {/* {userLocation && (
        <p>Your location: Latitude {userLocation.latitude}, Longitude {userLocation.longitude}</p>
      )} */}

        <div className="filter-inputs">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filterOptions.sortBy}
            onChange={handleFilterChange}
          >
            <option value="">Select</option>
            <option value="cheapest">Cheapest</option>
            <option value="expensive">Most Expensive</option>
          </select>
          <label htmlFor="houseType">House Type:</label>
          <select
            id="houseType"
            name="houseType"
            value={filterOptions.houseType}
            onChange={handleFilterChange}
          >
            <option value="">Select</option>
            <option value="Flat">Flat</option>
            <option value="Lot House">Lot House</option>
            <option value="Apartment">Apartment</option>
            {/* Add more options as needed */}
          </select>
          <div>
            <label htmlFor="showNearest">Show Nearest:</label>
            <input
              type="checkbox"
              id="showNearest"
              name="showNearest"
              checked={showNearest}
              // onChange={() => setShowNearest(!showNearest)}
              onChange={handleShowNearestChange}
            />
          </div>
          <div>
            <label htmlFor="showFarthest">Show Farthest:</label>
            <input
              type="checkbox"
              id="showFarthest"
              name="showFarthest"
              checked={showFarthest}
              // onChange={() => setShowFarthest(!showFarthest)}
              onChange={handleShowFarthestChange}
            />
          </div>
        </div>
        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>


      {/* {nearestHouse && (
            <div className="nearest-house">
            Nearest House:
            <div>No: {nearestHouse.id}</div>
            <div>Latitude and Longitude: {nearestHouse.latitude},{nearestHouse.longitude}</div>
            <div>Description: {nearestHouse.description}</div>
            <div>Rent Fee: {nearestHouse.rent_fee}</div>
            <div>Preferred Occupants: {nearestHouse.prefered_occupants}</div>
            <div>Type of House: {nearestHouse.type_of_house}</div>
            <div>Number of Rooms: {nearestHouse.number_of_rooms}</div>
          </div>

      )} */}


      {rentHouses.length === 0 ? (
        <p>No rent houses found nearby.</p>
      ) : (
        <ul>
          {rentHouses.map((house) => (
            <li key={house.id} className="property-item">
           
              <div className="image-container">
                {/* <img src={house.image} alt="Property" /> */}
                <img src="/dummy.png" alt="Property" />
              </div>
              <div className="details-container">
                <div>No: {house.id}</div>
                <div>Owner ID: {house.user_id}</div>
                <div>Latitude and Longitude: {house.latitude},{house.longitude}</div>
                <div>Description: {house.description}</div>
                <div>Rent Fee: {house.rent_fee}</div>
                <div>Preferred Occupants: {house.prefered_occupants}</div>
                <div>Type of House: {house.type_of_house}</div>
                <div>Number of Rooms: {house.number_of_rooms}</div>

                {userLocation && (
                <div>Distance from your location: {calculateDistance(userLocation.latitude, userLocation.longitude, house.latitude, house.longitude)} km</div>
                )}
              <div>
                  {/* <button onClick={() => handleDelete(house.id)}>Delete</button> */}
                  {/* <button onClick={() => handleUpdate(house.id)}>Update</button> */}
                  <button onClick={() => handleHouseDetails(house.id)}>See Details</button>
                  <button onClick={() => handleChatOwner(house.id, house.user_id)}>Chat Owner</button>

                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default RentNearby;
