import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/renter/my_property.css";
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
  const apiURL = process.env.REACT_APP_XANN_API;


  const handleContractDetails = async (houseId) => {
    try {
      // const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
      const response = await axios.get(`${apiURL}/api/get-UniIdentifier/${houseId}`);
      const uniIdentifier = response.data.uni_identifier;
      navigate(`/house-contract-details`, { state: { uniIdentifier } });
    } catch (error) {
      console.error("Error fetching house unique identifier:", error);
      if (error.response) {
        console.error(`Server responded with status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(`Error message: ${error.message}`);
      }
    }
  };

  const handleIssue = async (houseId) => {
    try {
      // const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
      const response = await axios.get(`${apiURL}/api/get-UniIdentifier/${houseId}`);
      const uniIdentifier = response.data.uni_identifier;
      navigate(`/approve-deposit`, { state: { uniIdentifier } });
    } catch (error) {
      console.error("Error fetching house unique identifier:", error);
      if (error.response) {
        console.error(`Server responded with status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(`Error message: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    // axios.get(`http://127.0.0.1:8000/api/applied-houses/${userId}`)
    axios.get(`${apiURL}/api/applied-houses/${userId}`)
      .then(response => {
        setAppliedHouses(response.data);
        console.log('response:', response);
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
          // await axios.put(`http://127.0.0.1:8000/api/tenants/${houseId}`, { tenant_status: 'cancelled' });
          // const response = await axios.get(`http://127.0.0.1:8000/api/applied-houses/${userId}`);
          await axios.put(`${apiURL}/api/tenants/${houseId}`, { tenant_status: 'cancelled' });
          const response = await axios.get(`${apiURL}/api/applied-houses/${userId}`);
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
          // const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
          const response = await axios.get(`${apiURL}/api/get-UniIdentifier/${houseId}`);
          const uniqueIdentifier = response.data.uni_identifier;
          navigate(`/sign-now`, { state: { uniqueIdentifier, houseId } });
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
    <div className="container-my-property">
      <div className="row-my-property">
        <div className="col-md-12">
          <h3 className="text-center text-primary mb-4">Signed Rental Contracts</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="thead-dark">
                <tr>
                  <th>House ID</th>
                  <th>Landlord</th>
                  <th>Status</th>
                  <th>Date Signed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appliedHouses
                  .filter(house => house.tenant_status === 'Approved' && house.sign_contract_status === 'Signed')
                  .map(house => (
                    <tr key={house.id}>
                      <td>{house.house_id}</td>
                      <td>{house.house.owner.name}</td>
                      <td>{house.sign_contract_status}</td>
                      <td>{new Date(house.updated_at).toLocaleDateString()}</td>
                      <td>
                        {/* <button className="btn btn-success btn-sm action-btn" onClick={() => handleContractDetails(house.house_id)}>
                          Contract Details
                        </button> */}
                        <div className='btn-container-details'>
                          <button className="btn-my-property-sign-now" onClick={() => handleContractDetails(house.house_id)}>
                            Contract Details
                          </button>
                        </div>
                        {/* <button className="btn btn-danger btn-sm action-btn me-2" onClick={() => handleIssue(house.house_id)}>
                          Issue
                        </button> */}
                        <div className='btn-container-cancel'>
                            <button className="btn-my-property-sign-now" onClick={() => handleIssue(house.house_id)}>
                              Issue
                            </button>
                          </div>
                        {/* <button className="btn btn-primary btn-sm action-btn" onClick={() => handleContractDetails(house.house_id)}>
                          Chat Now
                        </button> */}
                        <div className='btn-container-chat'>
                          <button className="btn-my-property-sign-now" onClick={() => handleContractDetails(house.house_id)}>
                            Chat Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row-my-property">
        <div className="col-md-12">
          <h3 className="text-center text-info mb-4">Pending and Approved Applications</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="thead-dark">
                <tr>
                  <th>House Id</th>
                  <th>Landlord</th>
                  <th>Contact No</th>
                  <th>Application Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appliedHouses
                  .filter(house => house.tenant_status === 'Pending' || (house.tenant_status === 'Approved' && house.sign_contract_status === 'Unsigned'))
                  .map(house => (
                    <tr key={house.id}>
                      <td>{house.house_id}</td>
                      <td>{house.house.owner.name}</td>
                      <td>{house.house.owner.phone_number}</td>
                      <td>{house.tenant_status}</td>
                      <td>{new Date(house.created_at).toLocaleDateString()}</td>
                      <td>
                        {house.tenant_status === 'Approved' && house.sign_contract_status === 'Unsigned' && (
                          <div className='btn-container-sign'>
                            <i className="fas fa-check"></i>
                            <button className="btn-my-property-sign-now" onClick={() => handleSignNow(house.house_id)}>
                              Sign Now
                            </button>
                          </div>
                        )}
                        {house.tenant_status !== 'Approved' && (
                          <div className='btn-container-cancel'>
                            <button className="btn-my-property-sign-now" onClick={() => handleCancel(house.id)}>
                              Cancel Application
                            </button>
                          </div>
                        )}
                        <div className='btn-container-details'>
                          <button className="btn-my-property-sign-now" onClick={() => handleContractDetails(house.house_id)}>
                            Contract Details
                          </button>
                        </div>
                        <div className='btn-container-chat'>
                          <button className="btn-my-property-sign-now" onClick={() => handleContractDetails(house.house_id)}>
                            Chat Now
                          </button>
                        </div>
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
