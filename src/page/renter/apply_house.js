import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const ConfirmationPage = ({ onSubmit }) => {
  const [uniIdentifier, setUniIdentifier] = useState('');
//   const [isConfirmed, setIsConfirmed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage modal visibility
  const { houseId } = useParams();

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/compare-identifier', {
        uniIdentifier: uniIdentifier,
        houseId: houseId,
      });
      console.log("API Response:", response.data);
    //   setIsConfirmed(response.data.isMatch);
      setIsConfirmed(response.data);
      setShowConfirmation(true); // Show confirmation modal
      setIsLoading(false);
    } catch (error) {
      console.error('Error confirming university identifier:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(uniIdentifier);
  };

console.log("Ismatch:", isConfirmed);
// console.log("uni id:", uniIdentifier);

  return (
    <div className="form-container mt-3">
      <h2>Confirm Rental Applicant</h2>
      {/* {!isConfirmed && ( */}
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
            <Button variant="primary" type="submit">
              {isLoading ? 'Confirming...' : 'Confirm and Submit'}
            </Button>
          </Form>
        </div>
     {/* )} */}
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
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default ConfirmationPage;
