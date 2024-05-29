import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Button, Spinner, Alert, Table } from 'react-bootstrap';
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useLocation } from 'react-router-dom';

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const contractAbi = HouseRentalContract.abi;

const DepositReleaseRequests = () => {
  const [contract, setContract] = useState(null);
  const [depositBalance, setDepositBalance] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const contractId = location.state.uniIdentifier;

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const userSigner = await provider.getSigner();
        const rentalContract = new ethers.Contract(contractAddress, contractAbi, userSigner);

        setContract(rentalContract);
      } else {
        setError('Please install MetaMask!');
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (contract) {
        try {
          const balance = await contract.getDepositBalance(contractId);
          setDepositBalance(ethers.formatEther(balance));

          // Fetch past events
          const filter = contract.filters.DepositReleaseRequested(contractId);
          const events = await contract.queryFilter(filter);
          const eventDetails = events.map(event => ({
            amount: ethers.formatEther(event.args.amount),
            timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleString() // Convert BigInt to Number
          }));
          setEvents(eventDetails);
        } catch (err) {
          console.error(err);
          setError('Error fetching contract details');
        }
      }
    };

    fetchContractDetails();
  }, [contract, contractId]);

  const approveDepositRelease = async (amount) => {
    if (contract) {
      setLoading(true);
      setError('');

      try {
        const tx = await contract.approveDepositRelease(contractId, ethers.parseEther(amount.toString()));
        await tx.wait();
        setLoading(false);
        alert('Deposit release approved');
      } catch (err) {
        console.error(err);
        setError('Error approving deposit release');
        setLoading(false);
      }
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4">Deposit Release Requests</h2>
      {error && (
        <Row className="justify-content-center mb-3">
          <Col md={6}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center">
        <Col md={6}>
          <p><strong>Deposit Balance:</strong> {depositBalance} ETH</p>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Requested Amount (ETH)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.timestamp}</td>
                  <td>{event.amount}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => approveDepositRelease(event.amount)}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => console.log("Rejected")} // Implement reject logic if needed
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default DepositReleaseRequests;
