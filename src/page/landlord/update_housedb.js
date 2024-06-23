import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import "../../style/contract.css";

//const UpdateRentHouse = ({ houseId }) => {
const UpdateRentHouse = (props) => {
  // State variables to hold the form data
  const [description, setDescription] = useState("");
  const [rent_fee, setRentFee] = useState("");
  const [prefered_occupants, setPreferredOccupants] = useState("");
  const [type_of_house, setTypeOfHouse] = useState("");
  const [number_of_rooms, setNumberOfRooms] = useState("");

  const navigate = useNavigate(); // Initialize useHistory
  const { houseId } = useParams();

  useEffect(() => {
    console.log("Current houseId:", houseId);
  }, [houseId]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an HTTP PUT request to update the rent house details
      await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, {
        description,
        rent_fee,
        prefered_occupants,
        type_of_house,
        number_of_rooms,
      });
      // Redirect the user to the rent house list page after successful update
      window.location.href = "/yourhouse-list";
    } catch (error) {
      console.error("Error updating rent house:", error);
      // Handle error
    }
  };

  return (
    <div className="update-formdb-container">
        <div className="form-container">
        {/* <div className="update-form-container"> */}
      <h2>Update Rent House</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Description */}
        <div className="row">
            <div className="col-25">
        <label htmlFor="description">Description:</label>
            </div>
            <div className="col-75">
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
            </div>
        </div>

        {/* Rent Fee */}
        <div className="row">
            <div className="col-25">
        <label htmlFor="rentFee">Rent Fee:</label>
            </div>
        <div className="col-75"> 
        <input
          type="text"
          id="rentFee"
          value={rent_fee}
          onChange={(e) => setRentFee(e.target.value)}
        />
            </div>
        </div>

        {/* Preferred Occupants */}
        <div className="row">
            <div className="col-25">
            <label htmlFor="preferredOccupants">Preferred Occupants:</label>
            </div>
            <div className="col-75">
            <input
          type="text"
          id="preferredOccupants"
          value={prefered_occupants}
          onChange={(e) => setPreferredOccupants(e.target.value)}
        />
            </div>
        </div>
        
        {/* Type of House */}
        <div className="row">
            <div className="col-25">
            <label htmlFor="typeOfHouse">Type of House:</label>
            </div>
            <div className="col-75">
            <input
          type="text"
          id="typeOfHouse"
          value={type_of_house}
          onChange={(e) => setTypeOfHouse(e.target.value)}
        />
            </div>
        </div>

        {/* Number of Rooms */}
        <div className="row">
            <div className="col-25">
            <label htmlFor="numberOfRooms">Number of Rooms:</label>
            </div>
            <div className="col-75">
            <input
          type="text"
          id="numberOfRooms"
          value={number_of_rooms}
          onChange={(e) => setNumberOfRooms(e.target.value)}
        />
            </div>
        </div>

        {/* Submit button */}
        {/* <button type="submit">Update</button>
        <button type="button" onClick={() => navigate(-1)}>Back</button> */}
        <div className='btn-container-sign'>
                  <button className="btn-my-property-sign-now" type="submit">Update</button>
        </div>
        <div className='btn-container-back'>
                  <button className="btn-my-property-sign-now" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UpdateRentHouse;
