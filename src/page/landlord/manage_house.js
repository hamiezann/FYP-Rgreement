import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { ethers } from 'ethers';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './manage_house.module.css'; 
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';

const ManageHouse = () => {
  const [description, setDescription] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [contractStatus, setContractStatus] = useState('');
  const [refundStatus, setRefundStatus] = useState('');
  const [contractId, setContractId] = useState('');
  const [depositBalance, setDepositBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const houseId = location.state?.houseId; 
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAbi = HouseRentalContract.abi;

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const userSigner = await provider.getSigner();
        const rentalContract = new ethers.Contract(contractAddress, contractAbi, userSigner);
        setContract(rentalContract);

        // Fetch the contractId from the server
        const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
        setContractId(response.data.uni_identifier);
      } else {
        setError('Please install MetaMask!');
      }
    };

    init();
  }, [houseId]);

  useEffect(() => {
    const fetchDepositBalance = async () => {
      if (contract && contractId) {
        try {
          const balance = await contract.getDepositBalance(contractId);
          setDepositBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error(err);
          setError('Error fetching deposit balance');
        }
      }
    };

    fetchDepositBalance();
  }, [contract, contractId]);

  const handleReportIssue = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/report-issue', { description });
      alert('Issue reported successfully');
      setDescription('');
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Failed to report issue');
    }
  };

  const handleChat = (e) => {
    e.preventDefault();
    alert('Chat message sent: ' + chatMessage);
    setChatMessage('');
  };

  const handleEndContract = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to end this contract?')) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { contract_status: 'Contract Ended' });

        if (contract && contractId) {
          const tx = await contract.endContract(contractId);
          await tx.wait();
          console.log('Successfully ended contract. Contract Id:', contractId);
          setContractStatus('Contract Ended');
        }
      } catch (error) {
        console.error('Error ending contract', error);
        setError('Error ending contract');
      }
    }
  };

  const handleReleaseDeposit = async () => {
    if (contract && contractId) {
      try {
        const tx = await contract.refundDeposit(contractId);
        await tx.wait();
        console.log('Deposit released successfully');
        setDepositBalance(0); // Assuming the entire deposit is refunded
        setRefundStatus('Deposit Refunded');
      } catch (err) {
        console.error('Error releasing deposit', err);
        setError('Error releasing deposit');
      }
    }
  };

  return (
    <Container fluid className="p-3">
      <Row>
        <Col md={2} className="sidebar">
          <div className={styles.sidebar}>
            <h3 className="text-center">Dracu</h3>
            <ul className="list-unstyled">
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#report-issue">Report Issue</a></li>
              <li><a href="#chat-now">Chat Now</a></li>
              <li><a href="#end-contract">End Contract</a></li>
              <li><a href="#refund-deposit">Refund Deposit</a></li>
            </ul>
          </div>
        </Col>
        <Col md={10} className="main-content">
          <section id="dashboard">
            <h2>Rental House Management Dashboard</h2>
            {/* Add your dashboard content here */}
          </section>

          <section id="report-issue" className="mt-5">
            <Card>
              <Card.Header>Report an Issue</Card.Header>
              <Card.Body>
                <Form onSubmit={handleReportIssue}>
                  <Form.Group controlId="issueDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Describe the issue" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </section>

          <section id="chat-now" className="mt-5">
            <Card>
              <Card.Header>Chat Now</Card.Header>
              <Card.Body>
                <Form onSubmit={handleChat}>
                  <Form.Group controlId="chatMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter your message" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Send
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </section>

          <section id="end-contract" className="mt-5">
            <Card>
              <Card.Header>End Contract</Card.Header>
              <Card.Body>
                <Form onSubmit={handleEndContract}>
                  <Button variant="danger" type="submit">
                    End Contract
                  </Button>
                </Form>
                {contractStatus && <p className="mt-3">{contractStatus}</p>}
              </Card.Body>
            </Card>
          </section>

          <section id="refund-deposit" className="mt-5">
            <Card>
              <Card.Header>Refund Deposit</Card.Header>
              <Card.Body>
                <p><strong>Deposit Balance:</strong> {depositBalance} ETH</p>
                <Button variant="success" onClick={handleReleaseDeposit}>
                  Refund Deposit
                </Button>
                {refundStatus && <p className="mt-3">{refundStatus}</p>}
              </Card.Body>
            </Card>
          </section>

          {error && <p className="text-danger">{error}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default ManageHouse;
