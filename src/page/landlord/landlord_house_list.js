import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/landlord/landlord_house_list.css";

const RentHouseList = () => {
  const [rentHouses, setRentHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const navigate = useNavigate();

  const handleContractDetails = (uniIdentifier) => {
    navigate(`/house-contract-details`, { state: { uniIdentifier } });
  };

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

  const handleDeleteConfirmation = (houseId) => {
    setHouseToDelete(houseId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-rent-houses/${houseToDelete}`);
      setRentHouses(rentHouses.filter((house) => house.id !== houseToDelete));
      setShowDeleteModal(false);
      setHouseToDelete(null);
    } catch (error) {
      console.error("Error deleting rent house:", error);
    }
  };

  const handleUpdate = (houseId) => {
    const updateUrl = `/update-rent-house/${houseId}`;
    window.location.href = updateUrl;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        Error: {error.message}
      </Alert>
    );
  }

  return (
    <div className="main-container">
      <h2 className="page-title">Rent House List</h2>
      {rentHouses.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No rent houses found for this user.
        </Alert>
      ) : (
        <ul className="rent-house-list">
          {rentHouses.map((house) => (
            <li key={house.id} className="list-group-item">
              <div className="house-details">
                <div><strong>No:</strong> {house.id}</div>
                <div><strong>Latitude and Longitude:</strong> {house.latitude}, {house.longitude}</div>
                <div><strong>Description:</strong> {house.description}</div>
                <div><strong>Rent Fee:</strong> {house.rent_fee}</div>
                <div><strong>Preferred Occupants:</strong> {house.prefered_occupants}</div>
                <div><strong>Type of House:</strong> {house.type_of_house}</div>
                <div><strong>Number of Rooms:</strong> {house.number_of_rooms}</div>
              </div>
              <div className="button-group">
                <Button variant="danger" onClick={() => handleDeleteConfirmation(house.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleUpdate(house.id)}>Update</Button>
                <Button variant="success" onClick={() => handleContractDetails(house.uni_identifier)}>Contract Details</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button variant="secondary" className="back-button" onClick={() => navigate(-1)}>Back</Button>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this house?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RentHouseList;
