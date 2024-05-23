import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const TenantListPage = () => {
  const [pendingTenants, setPendingTenants] = useState([]);
  const [verifiedTenants, setVerifiedTenants] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // axios.get('http://127.0.0.1:8000/api/tenants')
   // axios.get('http://127.0.0.1:8000/api/tenants')
    axios.get(`http://127.0.0.1:8000/api/tenants?user_id=${userId}`)
      .then(response => {
        //console.log('Tenants:', response.data);
        setPendingTenants(response.data.pending_tenants);
        setVerifiedTenants(response.data.verified_tenants);
      })
      .catch(error => {
        console.error('Error fetching tenants:', error);
      });
  }, []);

  const handleApprove = async (tenantId, houseId) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      try {
        // Send HTTP request to update tenant status to 'approved'
        await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Approved' });

    
        await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { available: false });
     
        
        // Fetch updated tenant data after approval
        const response = await axios.get('http://127.0.0.1:8000/api/tenants');
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
        // Send HTTP request to update tenant status to 'rejected'
        await axios.put(`http://127.0.0.1:8000/api/tenants/${tenantId}`, { tenant_status: 'Rejected' });
  
        // Fetch updated tenant data after rejection
        const response = await axios.get('http://127.0.0.1:8000/api/tenants');
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
      <h2 className="text-center">Tenant List</h2>

      <div className="row mt-5">
        <div className="col-md-6">
          <h3 className="text-center">Pending Tenants</h3>
          <div className="table-responsive">
            <table className="table">
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
                    <button className="btn btn-success mr-2" onClick={() => handleApprove(tenant.id, tenant.house_id)}>Approve</button>

                      <button className="btn btn-danger" onClick={() => handleReject(tenant.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Approved Tenants</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contract Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifiedTenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td>{tenant.user.name}</td>
                    <td>{tenant.user.email}</td>
                    <td>{tenant.sign_contract_status}</td>
                    <td>
                      <button className="btn btn-primary" >Chat Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantListPage;
