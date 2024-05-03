import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useParams
import "../../style/landlord/landlord_house_list.css"; // Import CSS file


const RentHouseList = () => {
  const [rentHouses, setRentHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useHistory
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRentHouses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/list/${userId}/rent-houses`);
        setRentHouses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rent houses:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchRentHouses();
  }, []);

  const handleDelete = async (houseId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-rent-houses/${houseId}`);
      // Remove the deleted house from the rentHouses state
      setRentHouses(rentHouses.filter((house) => house.id !== houseId));
    } catch (error) {
      console.error("Error deleting rent house:", error);
    }
  };



const handleUpdate = (houseId) => {
    console.log("House ID:", houseId); // Log the house ID
    // Construct the URL for the update page
    const updateUrl = `/update-rent-house/${houseId}`;
    // Navigate to the update page
    window.location.href = updateUrl;
};



  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Rent House List</h2>
      {rentHouses.length === 0 ? (
        <p>No rent houses found for this user.</p>
      ) : (
        <ul className="rent-house-list">
          {rentHouses.map((house) => (
            <li key={house.id}>
              <div className="house-details">
                <div>No: {house.id}</div>
                <div>Latitude and Longitude: {house.latitude},{house.longitude}</div>
                <div>Description: {house.description}</div>
                <div>Rent Fee: {house.rent_fee}</div>
                <div>Preferred Occupants: {house.prefered_occupants}</div>
                <div>Type of House: {house.type_of_house}</div>
                <div>Number of Rooms: {house.number_of_rooms}</div>
              </div>
              <div className="button-group">
        
                <button className="delete-button" onClick={() => handleDelete(house.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(house.id)}>Update</button>

                {/* Add update button here */}
              </div>
            </li>
          ))}
        </ul>

        
      )}
              <button type="button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default RentHouseList;
