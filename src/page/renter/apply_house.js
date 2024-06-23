import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationPage = ({ onSubmit }) => {
  const [uniIdentifier, setUniIdentifier] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  //const [isConfirmed, setIsConfirmed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage modal visibility
  const { houseId } = useParams();
  const userId = localStorage.getItem('userId');
  const [applyStatus, setApplyStatus] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/compare-identifier', {
        uniIdentifier: uniIdentifier,
        houseId: houseId,
      });
     // console.log("API Response:", response.data);
      if (response.data.message === 'Applied Succesfully!') {
        setIsConfirmed(true); // Set confirmation state to true
        setShowConfirmation(true); // Show confirmation modal
      } else {
        setError(new Error('University identifier does not match the specified house ID')); // Set error state
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error confirming university identifier:', error);
      setError(error); // Set error state
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // onSubmit(uniIdentifier);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/apply-rent-house`,
        {
          tenant_id: userId,
          tenant_status: 'Pending',
          house_id: houseId ,
          sign_contract_status: 'Unsigned',
        });
      setApplyStatus(response.data);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error applying rent house:', error);
      setError(error);
    }
  };

// console.log("Ismatch:", isConfirmed);
//  console.log("UserId:", userId);
// console.log("Uni Id:", uniIdentifier);
//   console.log("House Id:", houseId);
  return (
    <div className='apply-container'>
    <div className="form-container">
      <h2>Confirm Rental Applicant</h2>
       {!isConfirmed && ( 
        <div>
          <p>Insert the special identifier for the rental property.</p>
          <p className="font-weight-bold">{uniIdentifier}</p>
          <Form onSubmit={handleConfirm}>
            <Form.Group controlId="confirmIdentifier">
              <Form.Label>Universal Identifier:</Form.Label>
              <Form.Control
                type="text"
                value={uniIdentifier}
                onChange={(e) => setUniIdentifier(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="btn btn-primary" type="submit">
              {isLoading ? 'Confirming...' : 'Confirm and Submit'}
            </Button>
          </Form>
        </div>
      )} 
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}> {/* Modal for confirmation message */}
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You have confirmed your university identifier.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit Application</Button>
        </Modal.Footer>
      </Modal>
      {applyStatus && <p>Application Status: {applyStatus.message}</p>}
      
      {error && <p>Error: {error.message}</p>}
 
    </div>
    </div>
  );
};

export default ConfirmationPage;
