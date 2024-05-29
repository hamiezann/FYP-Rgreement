import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const contractAbi = HouseRentalContract.abi;

const RequestDepositRelease = () => {
  const [contractId, setContractId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

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

  const handleRequestRelease = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const conversionRate = await fetchConversionRate();
      const etherAmount = amount / conversionRate;

      // Round to 18 decimal places
      const roundedEtherAmount = roundToMaxDecimals(etherAmount, 18);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const weiAmount = ethers.parseUnits(roundedEtherAmount.toString(), 'ether');
      console.log("Deposit posted: " ,weiAmount);
      const tx = await contract.requestDepositRelease(contractId, weiAmount);
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

      {message && (
        <Row className="justify-content-center mt-4">
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

export default RequestDepositRelease;

function roundToMaxDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
