import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../style/landlord/TenantListPage.module.css'; // Import the custom CSS module

const TenantListPage = () => {
  const [pendingTenants, setPendingTenants] = useState([]);
  const [verifiedTenants, setVerifiedTenants] = useState([]);
  const userId = localStorage.getItem('userId');
  const [contractId, setContractId] = useState('');
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  const handleIssue = (houseId) => {
    navigate(`/request-deposit-release`, { state: { houseId } });
  }

  const handleManageHouse = (houseId) => {
    navigate(`/manage-house`, { state: { houseId } });
  }

  const handleEndContract = async (houseId) => {
    // navigate(`/end-contract`, { state: { houseId } });

    if (window.confirm('Are you sure you want to end this contract?')) {
      try {
          await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { contract_status: 'Contract Ended' });

          if (contract && contractId) {
              const tx = await contract.endContract(contractId);
              await tx.wait();
              console.log('Successfully ended contract. Contract Id:', contractId);
          }
      } catch (error) {
          console.error('Error ending contract', error);
          setError('Error ending contract');
      }
  }
  };

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

  return (
    <div className="container mt-5">
      <h2 className={`text-center ${styles.header}`}>Tenant List</h2>

      <div className="row">
        <div className="col-md-12">
          <h3 className={`text-center ${styles.subHeader} mb-4`}>Pending Tenants</h3>
          <div className="table-responsive">
            <table className={`table table-bordered table-striped text-center ${styles.tableCustom}`}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td>{tenant.user.name}</td>
                    <td>{tenant.user.email}</td>
                    <td>{tenant.user.phone}</td>
                    <td>
                      <button className={`btn btn-success ${styles.buttonCustom}`} onClick={() => handleApprove(tenant.id, tenant.house_id)}>Approve</button>
                      <button className={`btn btn-danger ${styles.buttonCustom}`} onClick={() => handleReject(tenant.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='row mt-5'>
          <div className="col-md-12">
            <h3 className={`text-center ${styles.subHeader} mb-4`}>Approved Tenants</h3>
            <div className="table-responsive">
              <table className={`table table-bordered table-striped text-center ${styles.tableCustom}`}>
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
                        <button className={`btn btn-primary ${styles.buttonCustom}`}>Chat Now</button>
                        {tenant.sign_contract_status === 'Signed' && (
        <>
        {tenant.house.contract_status !== 'Contract Ended' && (
          <button className={`btn btn-warning ${styles.buttonCustom}`} onClick={() => handleIssue(tenant.house_id)}>Issue</button>
        )}
        <button className={`btn btn-danger ${styles.buttonCustom}`} onClick={() => handleEndContract(tenant.house_id)}>End Contract</button>
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
    </div>
  );
};

export default TenantListPage;
