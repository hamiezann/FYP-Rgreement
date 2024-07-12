import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy, faImage } from '@fortawesome/free-solid-svg-icons';
import "../../style/landlord/landlord_house_list.css";

const ConfirmationModal = ({ show, handleClose, handleConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ImageModal = ({ show, handleClose, imageUrl }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Property Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={imageUrl} alt="Property" className="img-fluid" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const RentHouseList = () => {
  const [rentHouses, setRentHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [visibleUniIdentifiers, setVisibleUniIdentifiers] = useState({});
  const [copySuccess, setCopySuccess] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_XANN_API;

  const handleContractDetails = (uniIdentifier) => {
    navigate(`/house-contract-details`, { state: { uniIdentifier } });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRentHouses = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/list/${userId}/rent-houses`);
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
      await axios.delete(`${apiURL}/api/delete-rent-houses/${houseToDelete}`);
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

  const toggleUniIdentifier = (houseId) => {
    setVisibleUniIdentifiers(prevState => ({
      ...prevState,
      [houseId]: !prevState[houseId]
    }));
  };

  const handleCopy = (houseId, uniIdentifier) => {
    navigator.clipboard.writeText(uniIdentifier).then(() => {
      setCopySuccess({ ...copySuccess, [houseId]: true });
      setTimeout(() => setCopySuccess({ ...copySuccess, [houseId]: false }), 2000);
    }, () => {
      console.error('Failed to copy text');
    });
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowImageModal(true);
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
    // <div className="main-container">
      <div className="property-list-container">
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
                <div className="house-title-l1"><strong>House #</strong>{house.id}</div>
                <div className="house-details-l1"><strong>Latitude and Longitude:</strong> {house.latitude}, {house.longitude}</div>
                <div className="house-details-l1"><strong>Description:</strong> {house.description}</div>
                <div className="house-details-l1"><strong>Rent Fee:</strong> {house.rent_fee}</div>
                <div className="house-details-l1"><strong>Preferred Occupants:</strong> {house.prefered_occupants}</div>
                <div className="house-details-l1"><strong>Type of House:</strong> {house.type_of_house}</div>
                <div className="house-details-l1"><strong>Number of Rooms:</strong> {house.number_of_rooms}</div>
                <div className="house-details-l1"><strong>Amenities:</strong> {house.amenities}</div>
                <div className="house-details-l1"><strong>Number of bedrooms:</strong> {house.num_bedrooms}</div>
                <div className="house-details-l1"><strong>Number of toilet:</strong> {house.num_toilets}</div>
                <div className="house-details-l1"><strong>Rent Address:</strong> {house.rent_address}</div>
                <div>
                  <button
                    className="btn btn-link p-0 mt-2"
                    onClick={() => toggleUniIdentifier(house.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FontAwesomeIcon icon={visibleUniIdentifiers[house.id] ? faEyeSlash : faEye} />
                    {visibleUniIdentifiers[house.id] ? 'Hide Uni Identifier' : 'Show Uni Identifier'}
                  </button>
                  <div className={`uni-identifier ${visibleUniIdentifiers[house.id] ? 'visible' : 'hidden'}`}>
                    <strong>Uni Identifier:</strong> {house.uni_identifier}
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{copySuccess[house.id] ? "Copied!" : "Copy to clipboard"}</Tooltip>}
                    >
                      <FontAwesomeIcon
                        icon={faCopy}
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                        onClick={() => handleCopy(house.id, house.uni_identifier)}
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="image-container">
                {house.images && house.images.length > 0 ? (
                  <img src={house.images[0].url} className="property-image" onClick={() => handleImageClick(house.images[0].url)} alt="Property" />
                ) : (
                  <img src="/dummy.png" className="property-image" alt="Property" />
                )}
                <button
                  className="btn btn-link p-0 mt-2 image-icon"
                  onClick={() => handleImageClick(house.image_url)}
                  style={{ display: house.image_url ? 'flex' : 'none', alignItems: 'center', gap: '5px' }}
                >
                  <FontAwesomeIcon icon={faImage} />
                </button>
              </div>
              <div className="button-group">
                <div className='btn-container-cancel'>
                  <button className="btn-my-property-sign-now" onClick={() => handleDeleteConfirmation(house.id)}>Delete</button>
                </div>
                <div className='btn-container-sign'>
                  <button
                    className="btn-my-property-sign-now"
                    onClick={() => handleUpdate(house.id)}
                    disabled={house.contract_status === "Contract Ended" || house.contract_status === "Active"}
                  >
                    Update
                  </button>
                </div>
                <div className='btn-container-details'>
                  <button className="btn-my-property-sign-now" onClick={() => handleContractDetails(house.uni_identifier)}>Contract Details</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='btn-container-back'>
        <button className="btn-my-property-sign-now" type="button" onClick={() => navigate(-1)}>Back</button>
      </div>

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

      {/* Image Modal */}
      <ImageModal show={showImageModal} handleClose={() => setShowImageModal(false)} imageUrl={currentImage} />
    </div>
  );
};

export default RentHouseList;
