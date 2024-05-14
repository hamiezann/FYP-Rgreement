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

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        console.log("Response data:", response.data); 
        setHouseDetails(response.data[0]); // Accessing the first element
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching house details:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
  }

  if (error || !houseDetails) {
    return <div className="alert alert-danger" role="alert">Error: Failed to fetch house details</div>;
  }

  console.log("houseDetails:", houseDetails);

  const handleApplyNow = (houseId) => {
    navigate(`/apply-house/${houseId}`);
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-6">
          <div className="product-image-container">
            <img src="/dummy.png" className="img-fluid" alt="House" />
          </div>
        </div>
        <div className="col-md-6">
          <h2>House Details</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Preferred Occupants:</strong> {houseDetails.prefered_occupants}</li>
            <li className="list-group-item"><strong>Type of House:</strong> {houseDetails.type_of_house}</li>
            <li className="list-group-item"><strong>Description:</strong> {houseDetails.description}</li>
            <li className="list-group-item"><strong>Rent Fee:</strong> {houseDetails.rent_fee}</li>
            <li className="list-group-item"><strong>Number of Rooms:</strong> {houseDetails.number_of_rooms}</li>
          </ul>
          <div className="mt-3">
            <button className="btn btn-primary me-2">Chat Now</button>
            <button className="btn btn-success" onClick={() => handleApplyNow(houseId)}>Apply</button>
          </div>
        </div>
      </div>
      <div className="extra-space"></div>
    </div>
  );
};

export default HouseDetailPage;
