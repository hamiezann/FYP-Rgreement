import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const contractAbi = HouseRentalContract.abi;

const EventsPage = () => {
  const [contractId, setContractId] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchEvents = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      const filters = {
        contractCreated: contract.filters.ContractCreated(contractId),
        contractUpdated: contract.filters.ContractUpdated(contractId),
        contractSigned: contract.filters.ContractSigned(contractId),
        depositPaid: contract.filters.DepositPaid(contractId),
        depositReleaseRequested: contract.filters.DepositReleaseRequested(contractId),
        depositReleased: contract.filters.DepositReleased(contractId),
        contractEnded: contract.filters.ContractEnded(contractId),
      };

      const events = [];

      for (const [eventName, filter] of Object.entries(filters)) {
        const eventLogs = await contract.queryFilter(filter);
        eventLogs.forEach(log => {
          events.push({
            event: eventName,
            transactionHash: log.transactionHash,
            args: Object.fromEntries(
              Object.entries(log.args).map(([key, value]) => {
                if (typeof value === 'bigint') {
                  // Convert BigInt to string
                  return [key, value.toString()];
                }
                return [key, value];
              })
            ),
            timestamp: new Date(Number(log.args.timestamp) * 1000).toLocaleString()
          });
        });
      }

      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Contract Events</h2>
      <Form onSubmit={handleFetchEvents}>
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
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" type="submit">Fetch Events</Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="mt-5">
          {events.map((event, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{event.event}</Card.Title>
                  <Card.Text>
                    <strong>Transaction Hash:</strong> {event.transactionHash}<br />
                    <strong>Timestamp:</strong> {event.timestamp}<br />
                    <strong>Event Data:</strong> {JSON.stringify(event.args)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EventsPage;
