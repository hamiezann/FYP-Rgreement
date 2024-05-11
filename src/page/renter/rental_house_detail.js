import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/renter/rental_house_detail.css";

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const [houseDetails, setHouseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
//   useEffect(() => {
//     console.log("Current houseId:", houseId);
//   }, [houseId]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        console.log("Response data:", response.data); 
        setHouseDetails(response.data);
       // console.log("Response data:",houseDetails); 
        // setHouseDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching house details:", error);
        setError(error);
        setIsLoading(false);
      }

    };

    fetchHouseDetails();
//   }, [houseId]);
  }, [houseId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !houseDetails) {
    return <p>Error: Failed to fetch house details</p>;
  }

  console.log("houseDetails:", houseDetails);

  const handleApplyNow = (houseId) => {
   
      navigate(`/apply-house/${houseId}`);
  };

  return (
    <div className="product-page">
      <div className="product-image-container">
        {/* <img src={houseDetails.imageUrl} alt="House" /> */}
        <img src="/dummy.png" ></img>
      </div>
      <div className="product-details">
      <div>Preferred Occupants: {houseDetails[0].prefered_occupants}</div>
      <div>Type of House: {houseDetails[0].type_of_house}</div>
      <div>Description: {houseDetails[0].description}</div>
      <div>Rent Fee: {houseDetails[0].rent_fee}</div>
      <div>Number of Rooms: {houseDetails[0].number_of_rooms}</div>
        <button>Chat Now</button>
        <button onClick={() =>handleApplyNow(houseId)}>Apply</button>

      </div>
    </div>
  );
};

export default HouseDetailPage;
