import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Button, Spinner, Alert, Table } from 'react-bootstrap';
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useLocation } from 'react-router-dom';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;

const DepositReleaseRequests = () => {
  const [contract, setContract] = useState(null);
  const [depositBalance, setDepositBalance] = useState(0);
  const [requests, setRequests] = useState([]);
  // const [activeRequests, setActiveRequests] = useState([]);
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

  // useEffect(() => {
  //   const fetchContractDetails = async () => {
  //     if (contract) {
  //       try {
  //         const balance = await contract.getDepositBalance(contractId);
  //         setDepositBalance(ethers.formatEther(balance));
  
  //         // Fetch deposit release requests
  //         const requests = await contract.getDepositReleaseRequests(contractId);
  //         const formattedRequests = requests.map((request, index) => ({
  //           ...request,
  //           amount: ethers.formatEther(request.amount),
  //           timestamp: new Date(Number(request.timestamp) * 1000).toLocaleString(),
  //           index
  //         }));
  
  //         // Filter active deposit release requests
  //         const activeRequests = formattedRequests.filter(request => request.active);
  
  //         setRequests(activeRequests);
  //         // setActiveRequests(activeRequests);
  //       } catch (err) {
  //         console.error(err);
  //         setError('Error fetching contract details');
  //       }
  //     }
  //   };
  
  //   fetchContractDetails();
  // }, [contract, contractId]);
  

  // useEffect(() => {
  //   const fetchContractDetails = async () => {
  //     if (contract) {
  //       try {
  //         const balance = await contract.getDepositBalance(contractId);
  //         setDepositBalance(ethers.formatEther(balance));

  //         // Fetch deposit release requests
  //         const requests = await contract.getDepositReleaseRequests(contractId);
  //         const formattedRequests = requests.map((request, index) => ({
  //           ...request,
  //           amount: ethers.formatEther(request.amount),
  //           timestamp: new Date(Number(request.timestamp) * 1000).toLocaleString(),
  //           index
  //         }));
  //         setRequests(formattedRequests);
        
  //       //  const activeRequests = allRequests.filter(request => request.active);
  //       } catch (err) {
  //         console.error(err);
  //         setError('Error fetching contract details');
  //       }
  //     }
  //   };
    

  //   fetchContractDetails();
  // }, [contract, contractId]);

  useEffect(() => {
    const fetchContractDetails = async () => {
        if (contract) {
            try {
                const balance = await contract.getDepositBalance(contractId);
                setDepositBalance(ethers.formatEther(balance));

                // Fetch all deposit release requests
                const allRequests = await contract.getDepositReleaseRequests(contractId);

                // Filter active deposit release requests
                const formattedRequests = allRequests.map((request, index) => ({
                    ...request,
                    amount: ethers.formatEther(request.amount),
                    timestamp: new Date(Number(request.timestamp) * 1000).toLocaleString(),
                    index,
                    active: request.active // Ensure active status is properly set
                }));
                setRequests(formattedRequests);
            } catch (err) {
                console.error(err);
                setError('Error fetching contract details');
            }
        }
    };

    fetchContractDetails();
}, [contract, contractId]);


  const approveDepositRelease = async (index) => {
    if (contract) {
      setLoading(true);
      setError('');

      try {
        const tx = await contract.approveDepositRelease(contractId, index);
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

  const rejectDepositRelease = async (index) => {
    if (contract) {
      setLoading(true);
      setError('');

      try {
        const tx = await contract.rejectDepositRelease(contractId, index);
        await tx.wait();
        setLoading(false);
        alert('Deposit release rejected');
    
      } catch (err) {
        console.error(err);
        setError('Error rejecting deposit release');
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
              {/* {requests.map((request) => (
                <tr key={request.index}>
                  <td>{request.timestamp}</td>
                  <td>{request.amount}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => approveDepositRelease(request.index)}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => rejectDepositRelease(request.index)}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Reject'}
                    </Button>
                  </td>
                </tr>
              ))} */}

{requests.map((request) => (
                            <tr key={request.index}>
                                <td>{request.timestamp}</td>
                                <td>{request.amount}</td>
                                <td>
                                    {request.active ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => approveDepositRelease(request.index)}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner animation="border" size="sm" /> : 'Approve'}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="ml-2"
                                                onClick={() => rejectDepositRelease(request.index)}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner animation="border" size="sm" /> : 'Reject'}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="warning" disabled>Inactive</Button>
                                           
                                        </>
                                    )}
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
