import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

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

const RenterDashboard = () => {
  const [appliedHouses, setAppliedHouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/applied-houses/${userId}`)
      .then(response => {
        setAppliedHouses(response.data);
      })
      .catch(error => {
        console.error('Error fetching applied houses:', error);
      });
  }, [userId]);

  const openModal = (title, message, handleConfirm) => {
    setModalConfig({ title, message, handleConfirm });
    setShowModal(true);
  };

  const handleCancel = async (houseId) => {
    openModal(
      'Cancel Application',
      'Are you sure you want to cancel the application?',
      async () => {
        try {
          await axios.put(`http://127.0.0.1:8000/api/tenants/${houseId}`, { tenant_status: 'cancelled' });
          const response = await axios.get(`http://127.0.0.1:8000/api/applied-houses/${userId}`);
          setAppliedHouses(response.data);
          setShowModal(false);
          console.log('Application cancelled successfully');
        } catch (error) {
          console.error('Error cancelling application:', error);
        }
      }
    );
  };

  const handleSignNow = async (houseId) => {
    openModal(
      'Sign Contract',
      'Are you sure you want to sign the contract now?',
      async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
          const uniqueIdentifier = response.data.uni_identifier;
          navigate(`/sign-now`, { state: { uniqueIdentifier } });
          setShowModal(false);
        } catch (error) {
          console.error("Error fetching house unique identifier:", error);
          if (error.response) {
            console.error(`Server responded with status: ${error.response.status}`);
            console.error(`Response data: ${JSON.stringify(error.response.data)}`);
          } else {
            console.error(`Error message: ${error.message}`);
          }
        }
      }
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Renter Dashboard</h2>

      {/* Rental House Details Section */}
      <div className="row">
        <div className="col-md-12">
          <h3 className="text-center">Rental House Details</h3>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>House ID</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appliedHouses
                  .filter(house => house.tenant_status === 'Approved' && house.sign_contract_status === 'Signed')
                  .map(house => (
                    <tr key={house.id}>
                      <td>{house.house_id}</td>
                      <td>{house.address}</td>
                      <td>{house.tenant_status}</td>
                      <td>Contract Signed</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Applied Houses Section */}
      <div className="row mt-5">
        <div className="col-md-12">
          <h3 className="text-center">Applied Rental Houses</h3>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>House ID</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appliedHouses
                  .filter(house => house.tenant_status === 'Approved' && house.sign_contract_status === 'Unsigned')
                  .map(house => (
                    <tr key={house.id}>
                      <td>{house.house_id}</td>
                      <td>{house.tenant_status}</td>
                      <td>
                        <button className="btn btn-primary me-2" onClick={() => handleSignNow(house.house_id)}>
                          Sign Now
                        </button>
                        <button className="btn btn-danger" onClick={() => handleCancel(house.id)}>
                          Cancel Application
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={modalConfig.handleConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default RenterDashboard;
