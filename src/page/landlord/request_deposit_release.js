import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const contractAbi = HouseRentalContract.abi;

const RequestDepositReleasePage = () => {
  const [contractId, setContractId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchExchangeRate = async (currency) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`);
    return response.data.ethereum[currency];
  };

  const handleRequestRelease = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask to use this feature.');
        setLoading(false);
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const exchangeRate = await fetchExchangeRate(currency);
      const amountInEther = amount / exchangeRate;
      const amountInWei = ethers.parseEther(amountInEther.toString());

      const tx = await contract.requestDepositRelease(contractId, amountInWei);
      await tx.wait();

      setMessage('Deposit release requested successfully.');
    } catch (error) {
      console.error('Error requesting deposit release:', error);
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Request Deposit Release</h2>
      <Form onSubmit={handleRequestRelease}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Group controlId="contractId">
              <Form.Label>Contract ID</Form.Label>
              <Form.Control
                type="text"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
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
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                {/* Add more currencies as needed */}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Request Release'}
            </Button>
          </Col>
        </Row>
      </Form>
      {message && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>
              {message}
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default RequestDepositReleasePage;
