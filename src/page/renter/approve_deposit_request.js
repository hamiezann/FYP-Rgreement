// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { Container, Row, Col, Button, Spinner, Alert, Table } from 'react-bootstrap';
// import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const contractAbi = HouseRentalContract.abi;

// const DepositReleaseRequests = () => {
//   const [contract, setContract] = useState(null);
//   const [depositBalance, setDepositBalance] = useState(0);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const location = useLocation();
//   const contractId = location.state.uniIdentifier;

//   useEffect(() => {
//     const init = async () => {
//       if (typeof window.ethereum !== 'undefined') {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const userSigner = await provider.getSigner();
//         const rentalContract = new ethers.Contract(contractAddress, contractAbi, userSigner);

//         setContract(rentalContract);
//       } else {
//         setError('Please install MetaMask!');
//       }
//     };

//     init();
//   }, []);

//   useEffect(() => {
//     const fetchContractDetails = async () => {
//       if (contract) {
//         try {
//           const balance = await contract.getDepositBalance(contractId);
//           setDepositBalance(ethers.formatEther(balance));

//           // Fetch all deposit release requests
//           const allRequests = await contract.getDepositReleaseRequests(contractId);

//           // Filter active deposit release requests
//           const formattedRequests = allRequests.map((request, index) => ({
//             ...request,
//             amount: ethers.formatEther(request.amount),
//             timestamp: new Date(Number(request.timestamp) * 1000).toLocaleString(),
//             index,
//             active: request.active, // Ensure active status is properly set
//             issueId: request.issueId,
//           }));
//           setRequests(formattedRequests);
//         } catch (err) {
//           console.error(err);
//           setError('Error fetching contract details');
//         }
//       }
//     };

//     fetchContractDetails();
//   }, [contract, contractId]);

//   const approveDepositRelease = async (index, issueId) => {
//     if (contract) {
//       setLoading(true);
//       setError('');

//       try {
//         const tx = await contract.approveDepositRelease(contractId, index);
//         await tx.wait();

//         // Update status in backend
//         await axios.put(`http://127.0.0.1:8000/api/issues/update-status/${issueId}`, { status: 'accepted' });

//         setLoading(false);
//         alert('Deposit release approved');
//       } catch (err) {
//         console.error(err);
//         setError('Error approving deposit release');
//         setLoading(false);
//       }
//     }
//   };

//   const rejectDepositRelease = async (index, issueId) => {
//     if (contract) {
//       setLoading(true);
//       setError('');

//       try {
//         const tx = await contract.rejectDepositRelease(contractId, index);
//         await tx.wait();

//         // Update status in backend
//         await axios.put(`http://127.0.0.1:8000/api/issues/update-status/${issueId}`, { status: 'rejected' });

//         setLoading(false);
//         alert('Deposit release rejected');
//       } catch (err) {
//         console.error(err);
//         setError('Error rejecting deposit release');
//         setLoading(false);
//       }
//     }
//   };

//   const [issueDetails, setIssueDetails] = useState(null);

//   const fetchIssueDetails = async (issueId) => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/issues/${issueId}`);
//       console.log(response.data); // Log the response to check the structure
//       setIssueDetails(response.data);
//     } catch (err) {
//       console.error(err);
//       setError('Error fetching issue details');
//     }
//   };

//   return (
//     <div className="main-container">
//       <h2 className="text-center mb-4">Deposit Release Requests</h2>
//       {error && (
//         <Row className="justify-content-center mb-3">
//           <Col md={6}>
//             <Alert variant="danger">{error}</Alert>
//           </Col>
//         </Row>
//       )}
//       <Row className="justify-content-center">
//         <Col md={6}>
//           <p><strong>Deposit Balance:</strong> {depositBalance} ETH</p>
//           <Table striped bordered hover className="mt-4">
//             <thead>
//               <tr>
//                 <th>Timestamp</th>
//                 <th>Issue Id</th>
//                 <th>Requested Amount (ETH)</th>
//                 <th>Actions</th>
//                 <th>Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((request) => (
//                 <tr key={request.index}>
//                   <td>{request.timestamp}</td>
//                   <td>{request.issueId}</td>
//                   <td>{request.amount}</td>
//                   <td>
//                     {request.active ? (
//                       <>
//                         <Button
//                           variant="success"
//                           onClick={() => approveDepositRelease(request.index, request.issueId)}
//                           disabled={loading}
//                         >
//                           {loading ? <Spinner animation="border" size="sm" /> : 'Approve'}
//                         </Button>
//                         <Button
//                           variant="danger"
//                           className="ml-2"
//                           onClick={() => rejectDepositRelease(request.index, request.issueId)}
//                           disabled={loading}
//                         >
//                           {loading ? <Spinner animation="border" size="sm" /> : 'Reject'}
//                         </Button>
//                       </>
//                     ) : (
//                       <Button variant="warning" disabled>Inactive</Button>
//                     )}
//                   </td>
//                   <td>
//                     <Button onClick={() => fetchIssueDetails(request.issueId)}>View Details</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Col>
//       </Row>
//       {issueDetails && (
//         <Row className="justify-content-center mt-5">
//           <Col md={6}>
//             <h4>Issue Details</h4>
//             <p><strong>Description:</strong> {issueDetails.description}</p>
//             <p><strong>Status:</strong> {issueDetails.status}</p>
//             {issueDetails.image ? (
//               <div className="mt-3">
//                 <img src={`http://127.0.0.1:8000/storage/${issueDetails.image}`} alt="Property" className="img-fluid" />
//                 {/* <img src={issueDetails.image[0].url} alt="Property" className="img-fluid" /> */}
//               </div>
//             ) : (
//               <p>No image available</p>
//             )}
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default DepositReleaseRequests;
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/landlord/TenantListPage.css'; // Import the custom CSS file

import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;

const DepositReleaseRequests = () => {
  const [contract, setContract] = useState(null);
  const [depositBalance, setDepositBalance] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [issueDetails, setIssueDetails] = useState(null);

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

          const allRequests = await contract.getDepositReleaseRequests(contractId);

          const formattedRequests = allRequests.map((request, index) => ({
            ...request,
            amount: ethers.formatEther(request.amount),
            // issueId: request.issueId,
            timestamp: new Date(Number(request.timestamp) * 1000).toLocaleString(),
            index,
            active: request.active,
            
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

  const approveDepositRelease = async (index, issueId) => {
    if (contract) {
      setLoading(true);
      setError('');
      try {
        const tx = await contract.approveDepositRelease(contractId, index);
        await tx.wait();

        await axios.put(`http://127.0.0.1:8000/api/issues/update-status/${issueId}`, { status: 'accepted' });

        setLoading(false);
        alert('Deposit release approved');
      } catch (err) {
        console.error(err);
        setError('Error approving deposit release');
        setLoading(false);
      }
    }
  };

  const rejectDepositRelease = async (index, issueId) => {
    if (contract) {
      setLoading(true);
      setError('');
      try {
        const tx = await contract.rejectDepositRelease(contractId, index);
        await tx.wait();

        await axios.put(`http://127.0.0.1:8000/api/issues/update-status/${issueId}`, { status: 'rejected' });

        setLoading(false);
        alert('Deposit release rejected');
      } catch (err) {
        console.error(err);
        setError('Error rejecting deposit release');
        setLoading(false);
      }
    }
  };

  const fetchIssueDetails = async (issueId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/issues/${issueId}`);
      // console.log(response.data);
      setIssueDetails(response.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching issue details');
    }
  };

  return (
    <div className="text-center container-landlord-tenant">
      <h2 className="text-center header">Deposit Release Requests</h2>
      {error && (
        <div className="row justify-content-center mb-3">
          <div className="col-md-8">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          <h3 className="text-center subHeader mb-4">Pending Requests</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center tableCustom">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  {/* <th>Issue Id</th> */}
                  <th>Requested Amount (ETH)</th>
                  <th>Actions</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.index}>
                    <td>{request.timestamp}</td>
                    {/* <td>{request.issueId}</td> */}
                    <td>{request.amount}</td>
                    <td>
                      {request.active ? (
                        <div>
                           <div className='btn-container-details'>
                          <button
                            className="btn-my-property-sign-now"
                            onClick={() => approveDepositRelease(request.index, request.issueId)}
                            disabled={loading}
                          >
                            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Approve'}
                          </button>
                          </div>
                          <div className='btn-container-cancel'>
                          <button
                            className="btn-my-property-sign-now ms-2"
                            onClick={() => rejectDepositRelease(request.index, request.issueId)}
                            disabled={loading}
                          >
                            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Reject'}
                          </button>
                          </div>
                        </div>
                      ) : (
                        <div className='btn-container-sign'>

                        <button className="btn-my-property-sign-now" disabled>Inactive</button>
                        </div>
                      )}
                    </td>
                    <td>
                    <div className='btn-container-chat'>
                      <button className="btn-my-property-sign-now" onClick={() => fetchIssueDetails(request.issueId)}>View Details</button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {issueDetails && (
          <div className="row mt-5">
            <div className="col-md-12">
              <h4>Issue Details</h4>
              <p><strong>Description:</strong> {issueDetails.description}</p>
              <p><strong>Status:</strong> {issueDetails.status}</p>
              {issueDetails.image ? (
                <div className="mt-3">
                  <img src={`http://127.0.0.1:8000/storage/${issueDetails.image}`} alt="Property" className="img-fluid" />
                </div>
              ) : (
                <p>No image available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositReleaseRequests;
