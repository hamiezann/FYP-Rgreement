import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import DisplaySearchHouse from './display_search_house';

function FindHouse() {
  const [houseId, setHouseId] = useState('');
  const [submittedHouseId, setSubmittedHouseId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if houseId is not empty
    if (!houseId) {
      alert('Please enter a valid house ID.');
      return;
    }
    // Update the submittedHouseId state
    setSubmittedHouseId(houseId);
  };

  return (
    <div className="form-container">
      <h2>Find Houses</h2>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="houseId">
          <Form.Label>House ID:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter house Id"
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            Get your house Id from the RentBy page or your future landlord.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Check Out
        </Button>
      </form>

      {/* Conditionally render DisplaySearchHouse based on submittedHouseId */}
      {submittedHouseId && <DisplaySearchHouse houseId={submittedHouseId} />}
    </div>
  );
}

export default FindHouse;
