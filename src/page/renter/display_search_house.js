import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplaySearchHouse = ({ houseId }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        if (!houseId) {
          return; // Exit early if houseId is empty
        }
        const response = await axios.get(`http://127.0.0.1:8000/api/find-house/${houseId}`);
        setMessages(response.data); // Access response.data instead of response
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
      <div className="d-flex justify-content-center mt-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ); // Use Bootstrap spinner for loading state
  }

  if (error || !messages.length) {
    return (
      <div className="alert alert-danger" role="alert">
        Error fetching house details. Please try again later.
      </div>
    ); // Use Bootstrap alert for error message
  }

  return (
    <div className="house-detail-container card shadow-sm">
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-sm-3">Type of House:</div>
          <div className="col-sm-9">{messages[0].type_of_house}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-3">Description:</div>
          <div className="col-sm-9">{messages[0].description}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-3">Rent Fee:</div>
          <div className="col-sm-9">{messages[0].rent_fee}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-3">Number of Rooms:</div>
          <div className="col-sm-9">{messages[0].number_of_rooms}</div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySearchHouse;
