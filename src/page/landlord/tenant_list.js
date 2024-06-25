// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../style/landlord/TenantListPage.css'; // Import the custom CSS file

// const TenantListPage = () => {
//   const [pendingTenants, setPendingTenants] = useState([]);
//   const [verifiedTenants, setVerifiedTenants] = useState([]);
//   const userId = localStorage.getItem('userId');
//   const [contractId, setContractId] = useState('');
//   const navigate = useNavigate();
//   const [contract, setContract] = useState(null);
//   const [error, setError] = useState('');

//   const handleIssue = (houseId) => {
//     navigate(`/request-deposit-release`, { state: { houseId } });
//   }

//   const handleManageHouse = (houseId) => {
//     navigate(`/manage-house`, { state: { houseId } });
//   }

//   const handleEndContract = async (houseId) => {

//     navigate(`/end-contract`, { state: { houseId } });
//   };

//   useEffect(() => {
//     axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`)
//       .then(response => {
//         setPendingTenants(response.data.pending_tenants);
//         setVerifiedTenants(response.data.verified_tenants);
//       })
//       .catch(error => {
//         console.error('Error fetching tenants:', error);
//       });
//   }, [userId]);

//   const handleApprove = async (tenantId, houseId) => {
//     if (window.confirm('Are you sure you want to approve this application?')) {
//       try {
//         await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Approved' });
//         await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { available: false });

//         const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
//         setPendingTenants(response.data.pending_tenants);
//         setVerifiedTenants(response.data.verified_tenants);

//         console.log('Tenant approved successfully');
//       } catch (error) {
//         console.error('Error approving tenant:', error);
//       }
//     }
//   };

//   const handleReject = async (tenantId) => {
//     if (window.confirm('Are you sure you want to reject this application?')) {
//       try {
//         await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Rejected' });

//         const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
//         setPendingTenants(response.data.pending_tenants);
//         setVerifiedTenants(response.data.verified_tenants);

//         console.log('Tenant rejected successfully');
//       } catch (error) {
//         console.error('Error rejecting tenant:', error);
//       }
//     }
//   };

//   return (
//     <div className="text-center container-landlord-tenant">
//       <h2 className="text-center header">Tenant List</h2>

//       <div className="row">
//         <div className="col-md-12">
//           <h3 className="text-center subHeader mb-4">Pending Tenants</h3>
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped text-center tableCustom">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>House Id</th>
//                   <th>Phone</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingTenants.map(tenant => (
//                   <tr key={tenant.id}>
//                     <td>{tenant.user.name}</td>
//                     <td>{tenant.user.email}</td>
//                     <td>{tenant.house_id}</td>
//                     <td>{tenant.user.phone}</td>
//                     <td>
//                     <div className='btn-container-details'>
//                       <button className="btn-my-property-sign-now" onClick={() => handleApprove(tenant.id, tenant.house_id)}>Approve</button>
//                     </div>
//                     <div className='btn-container-cancel'>
//                       <button className="btn-my-property-sign-now" onClick={() => handleReject(tenant.id)}>Reject</button>
//                     </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className='row mt-5'>
//           <div className="col-md-12">
//             <h3 className="text-center subHeader mb-4">Approved Tenants</h3>
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped text-center tableCustom">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>House ID</th>
//                     <th>Contract Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {verifiedTenants.map(tenant => (
//                     <tr key={tenant.id}>
//                       <td>{tenant.user.name}</td>
//                       <td>{tenant.user.email}</td>
//                       <td>{tenant.house_id}</td>
//                       <td>{tenant.house.contract_status}</td>
//                       <td>
//                       <div className='btn-container-chat'>
//                         <button className="btn btn-primary buttonCustom">Chat Now</button>
//                         </div>
//                         {tenant.sign_contract_status === 'Signed' && (
//                           <>
//                             {tenant.house.contract_status !== 'Contract Ended' && (
//                               <>
//                               <div className='btn-container-sign'>
//                                 <button className="btn-my-property-sign-now" onClick={() => handleIssue(tenant.house_id)}>Issue</button>
//                                 </div>
//                                 {/* <div className='btn-container-cancel'>
//                                 <button className="btn-my-property-sign-now" onClick={() => handleEndContract(tenant.house_id)}>End Contract</button>
//                                 </div> */}
//                               </>
//                             )}
//                             <div className='btn-container-cancel'>
//                             <button className="btn-my-property-sign-now" onClick={() => handleEndContract(tenant.house_id)}>End Contract</button>
//                             </div>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TenantListPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import { ethers } from 'ethers';
import '../../style/landlord/TenantListPage.css'; // Import the custom CSS file

const TenantListPage = () => {
  const [pendingTenants, setPendingTenants] = useState([]);
  const [verifiedTenants, setVerifiedTenants] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [depositBalance, setDepositBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAbi = HouseRentalContract.abi;

  const handleIssue = (houseId) => {
    navigate(`/request-deposit-release`, { state: { houseId } });
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`)
      .then(response => {
        setPendingTenants(response.data.pending_tenants);
        setVerifiedTenants(response.data.verified_tenants);
      })
      .catch(error => {
        console.error('Error fetching tenants:', error);
      });
  }, [userId]);

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

  const handleApprove = async (tenantId, houseId) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Approved' });
        await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { available: false });

        const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
        setPendingTenants(response.data.pending_tenants);
        setVerifiedTenants(response.data.verified_tenants);

        console.log('Tenant approved successfully');
      } catch (error) {
        console.error('Error approving tenant:', error);
      }
    }
  };

  const handleReject = async (tenantId) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Rejected' });

        const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
        setPendingTenants(response.data.pending_tenants);
        setVerifiedTenants(response.data.verified_tenants);

        console.log('Tenant rejected successfully');
      } catch (error) {
        console.error('Error rejecting tenant:', error);
      }
    }
  };

  const fetchDepositBalance = async (contractId) => {
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

  const handleEndContract = async (houseId, contractId) => {
    if (window.confirm('Are you sure you want to end this contract?')) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { contract_status: 'Contract Ended' });

        if (contract && contractId) {
          const tx = await contract.endContract(contractId);
          await tx.wait();
          console.log('Successfully ended contract. Contract Id:', contractId);
        }

        // Refresh tenants list after ending contract
        const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
        setPendingTenants(response.data.pending_tenants);
        setVerifiedTenants(response.data.verified_tenants);
      } catch (error) {
        console.error('Error ending contract', error);
        setError('Error ending contract');
      }
    }
  };

  const handleReleaseDeposit = (houseId, contractId) => {
    setSelectedHouseId(contractId);
    fetchDepositBalance(contractId);
    setShowModal(true);
  };

  const confirmReleaseDeposit = async (contractId) => {
    if (contract && contractId) {
      try {
        const tx = await contract.refundDeposit(contractId);
        await tx.wait();
        console.log('Deposit released successfully');
        setDepositBalance(0); // Assuming the entire deposit is refunded
        setShowModal(false);
      } catch (err) {
        console.error('Error releasing deposit', err);
        setError('Error releasing deposit');
      }
    }
  };

  // const handleReleaseDeposit = async (houseId, tenantId, contractId, depositAmount) => {
  //   if (window.confirm('Are you sure you want to release the deposit?')) {
  //     try {
  //       if (contract && contractId) {
  //         const tx = await contract.releaseDeposit(contractId, ethers.parseUnits(depositAmount.toString(), 'ether'));
  //         await tx.wait();
  //         console.log('Successfully released deposit. Contract Id:', contractId);
  
  //         // Update tenant deposit release status in backend
  //         // await axios.put(`http://127.0.0.1:8000/api/update-tenant/${tenantId}`, { deposit_released: true });
  
  //         // Refresh tenants list after releasing deposit
  //         const response = await axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`);
  //         setPendingTenants(response.data.pending_tenants);
  //         setVerifiedTenants(response.data.verified_tenants);
  //       }
  //     } catch (error) {
  //       console.error('Error releasing deposit', error);
  //       setError('Error releasing deposit');
  //     }
  //   }
  // };
  

  return (
    <div className="text-center container-landlord-tenant">
      <h2 className="text-center header">Tenant List</h2>

      <div className="row">
        <div className="col-md-12">
          <h3 className="text-center subHeader mb-4">Pending Tenants</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center tableCustom">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>House Id</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td>{tenant.user.name}</td>
                    <td>{tenant.user.email}</td>
                    <td>{tenant.house_id}</td>
                    <td>{tenant.user.phone}</td>
                    <td>
                      <div className='btn-container-details'>
                        <button className="btn-my-property-sign-now" onClick={() => handleApprove(tenant.id, tenant.house_id)}>Approve</button>
                      </div>
                      <div className='btn-container-cancel'>
                        <button className="btn-my-property-sign-now" onClick={() => handleReject(tenant.id)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='row mt-5'>
          <div className="col-md-12">
            <h3 className="text-center subHeader mb-4">Approved Tenants</h3>
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center tableCustom">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>House ID</th>
                    <th>Contract Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedTenants.map(tenant => (
                    <tr key={tenant.id}>
                      <td>{tenant.user.name}</td>
                      <td>{tenant.user.email}</td>
                      <td>{tenant.house_id}</td>
                      <td>{tenant.house.contract_status}</td>
                      <td>
                        <div className='btn-container-chat'>
                          <button className="btn btn-primary buttonCustom">Chat Now</button>
                        </div>
                        {tenant.sign_contract_status === 'Signed' && (
                          <>
                            {tenant.house.contract_status !== 'Contract Ended' && (
                              <>
                              <div className='btn-container-sign'>
                                <button className="btn-my-property-sign-now" onClick={() => handleEndContract(tenant.house_id, tenant.house.uni_identifier)}>End Contract</button>
                              </div>
                                <div className='btn-container-cancel'>
                                <button className="btn-my-property-sign-now" onClick={() => handleIssue(tenant.house_id)}>Issue</button>
                                </div>
                                </>
                            )}
                            {tenant.house.contract_status === 'Contract Ended' && (
                              <div className='btn-container-cancel'>
                                <button className="btn-my-property-sign-now" onClick={() => handleReleaseDeposit(tenant.house_id, tenant.house.uni_identifier)}>Release Deposit</button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Release Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Deposit Balance:</strong> {depositBalance} ETH</p>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => confirmReleaseDeposit(selectedHouseId)}>
            Release
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TenantListPage;
