import React, { useState, useEffect } from 'react';
import { ethers, keccak256 } from 'ethers';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
// import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import HouseRentalContract from "../../HostedAbi/HouseRentalContract.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;
const apiURL = process.env.REACT_APP_XANN_API;

const RequestDepositRelease = () => {
  const [contractId, setContractId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [convertedValue, setConvertedValue] = useState('');
  const [error, setError] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [issue_id, setIssueId] = useState('');
  const landlord_id = localStorage.getItem('userId');
  const location = useLocation();
  const houseId = location.state?.houseId;

  const fetchConversionRate = async () => {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`);
    const data = await response.json();
    return data.ethereum[currency.toLowerCase()];
  };

  const updateConvertedValue = async (amount, currency) => {
    if (!amount) {
      setConvertedValue('');
      return;
    }
    const conversionRate = await fetchConversionRate();
    const etherAmount = amount / conversionRate;
    setConvertedValue(etherAmount.toFixed(18));
  };

  useEffect(() => {
    updateConvertedValue(amount, currency);
  }, [amount, currency]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        // const tenantResponse = await axios.get(`http://127.0.0.1:8000/api/tenant-by-house/${houseId}`);
        const response = await axios.get(`${apiURL}/api/house-details/${houseId}`);
        const tenantResponse = await axios.get(`${apiURL}/api/tenant-by-house/${houseId}`);
        setContractId(response.data[0].uni_identifier || '');
        setTenantId(tenantResponse.data.tenant_id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching house details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (houseId) {
      fetchHouseDetails();
    } else {
      setError('House ID is missing.');
    }
  }, [houseId]);

  // const generateUniqueId = () => {
  //   const timestamp = Date.now().toString();
  //   const randomNum = Math.floor(Math.random() * 1000000).toString();
  //   const combined = timestamp + randomNum;
  //   const hash = keccak256(Buffer.from(combined));
  //   return BigInt(hash).toString();
  // };

  const generateUniqueId = () => {
    const uuid = uuidv4();
  const numericPart = uuid.replace(/-/g, ''); // Remove hyphens
  const sixDigitId = parseInt(numericPart, 16) % 1000000; // Get the last 6 digits
  return sixDigitId;
  };
  
  const handleRequestRelease = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    try {
      const conversionRate = await fetchConversionRate();
      const etherAmount = amount / conversionRate;
      const roundedEtherAmount = roundToMaxDecimals(etherAmount, 18);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      // Generate unique issue ID
      const newIssueId = generateUniqueId();
      setIssueId(newIssueId);
  
      const weiAmount = ethers.parseUnits(roundedEtherAmount.toString(), 'ether');
      
      // Pass the correct issue_id to the contract call
      const tx = await contract.requestDepositRelease(contractId, weiAmount, newIssueId);
      await tx.wait();
  
      // Create issue in backend
      const formData = new FormData();
      formData.append('landlord_id', landlord_id);
      formData.append('renter_id', tenantId);
      formData.append('house_id', houseId);
      formData.append('description', description);
      if (image) formData.append('image', image);
      formData.append('amount_requested', amount);
      formData.append('status', 'pending');
      formData.append('issue_id', newIssueId); // Use the new issue ID
  
      // await axios.post('http://127.0.0.1:8000/api/issues/create', formData);
      await axios.post(`${apiURL}/api/issues/create`, formData);
  
      setMessage('Deposit release requested successfully.');
    } catch (error) {
      console.error('Error requesting deposit release:', error);
      setMessage(`Error: ${error.message}`);
    }
  
    setLoading(false);
  };
  

  const fetchIssueHistory = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/houses/${houseId}/issues`);
      setIssues(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching issue history:', error);
    }
  };

  return (
    <div className="main-container">
      <h2 className="text-center mb-4">Request Deposit Release</h2>
      {error && (
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      {!error && contractId && (
        <>
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="info">
                <strong>Contract ID: </strong>{contractId}
              </Alert>
            </Col>
          </Row>
          <Form onSubmit={handleRequestRelease}>
            <Row className="justify-content-center mt-3">
              <Col md={3}>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="currency">
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    as="select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="MYR">MYR</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center mt-3">
              <Col md={6}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center mt-3">
              <Col md={6}>
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center mt-3">
              <Col md={6}>
                {convertedValue && (
                  <Alert variant="info">
                    Converted Value: {convertedValue} ETH
                  </Alert>
                )}
              </Col>
            </Row>
            <Row className="justify-content-center mt-4">
              <Col md={6} className="d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" /> : 'Request Release'}
                </Button>
              </Col>
            </Row>
          </Form>
          <Row className="justify-content-center mt-4">
            <Col md={6} className="d-flex justify-content-center">
              <Button variant="secondary" onClick={fetchIssueHistory}>
                View Issue History
              </Button>
            </Col>
          </Row>
        </>
      )}
      {message && (
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>
              {message}
            </Alert>
          </Col>
        </Row>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Issue History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <Alert key={issue.id} variant="info">
                <p><strong>Description:</strong> {issue.description}</p>
                {/* {issue.image && (
                  <p>
                    <strong>Image:</strong> 
                    <img src={issue.image[0].url} className="card-img-top custom-img" alt="Property" />
                  </p>
                )} */}

                {issue.images && issue.images.map((image) => (
                  <p key={image.id}>
                    <strong>Image:</strong> <a href={image.url} target="_blank" rel="noopener noreferrer">View Image</a>
                  </p>
                ))}
                <p><strong>Status:</strong> {issue.status}</p>
                <p><strong>Amount Requested:</strong> {issue.amount_requested}</p>
              </Alert>
            ))
          ) : (
            <p>No issues found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RequestDepositRelease;

function roundToMaxDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
