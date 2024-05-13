import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RenterDashboard = () => {
  const [rentalHouseDetails, setRentalHouseDetails] = useState([]);
  const [appliedHouses, setAppliedHouses] = useState([]);
  const [pendingTenants, setPendingTenants] = useState([]);
  const [verifiedTenants, setVerifiedTenants] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch rental house details
    // axios.get('http://127.0.0.1:8000/api/rental-houses')
    //   .then(response => {
    //     setRentalHouseDetails(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching rental house details:', error);
    //   });

    // Fetch applied rental houses
    axios.get(`http://127.0.0.1:8000/api/applied-houses/${userId}`)
      .then(response => {
        setAppliedHouses(response.data);
      })
      .catch(error => {
        console.error('Error fetching applied houses:', error);
      });
  }, []);

  const handleCancel = async (houseId) => {
    if (window.confirm('Are you sure you want to cancel the application?')) {
      try {
        // Send HTTP request to update tenant status to 'cancelled'
        await axios.put(`http://127.0.0.1:8000/api/tenants/${houseId}`, { tenant_status: 'cancelled' });
  
        // Fetch updated applied houses data after cancellation
        const response = await axios.get('http://127.0.0.1:8000/api/applied-houses');
        setAppliedHouses(response.data);
  
        console.log('Application cancelled successfully');
      } catch (error) {
        console.error('Error cancelling application:', error);
      }
    }
  };
  
  const handleSignNow = (houseId) => {
    navigate(`/sign-now`, {state: {houseId}})
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Renter Dashboard</h2>

      {/* Rental House Details Section */}
      <div className="row mt-5">
        <div className="col-md-12">
          <h3 className="text-center">Rental House Details</h3>
          <div className="table-responsive">
            <table className="table">
              {/* Table headers */}
              <thead>
                <tr>
                  <th>House ID</th>
                  <th>Address</th>
                  <th>Status</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {/* {rentalHouseDetails.map(house => (
                  <tr key={house.id}>
                    <td>{house.id}</td>
                    <td>{house.address}</td>
                    <td>{house.tenant_status}</td>
                  
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Applied Houses Section */}
      <div className="row mt-5">
        <div className="col-md-12">
          <h3 className="text-center">Applied Rental Houses</h3>
          <div className="table-responsive">
            <table className="table">
              {/* Table headers */}
              <thead>
                <tr>
                  <th>House ID</th>
                  {/* <th>Address</th> */}
                  <th>Status</th>
                  {/* Add more columns as needed */}
                  <th>Action</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>

                 {/* {
               
                  appliedHouses.map(house => (
                  <tr key={house.id}>
                    <td>{house.house_id}</td>
 
                    <td>{house.tenant_status}</td>
                 
                    <td>
                        <button className='btn btn-danger' onClick={() => handleCancel(house.id)}>Cancel Application</button>
                     
                    </td>
             
                  </tr>
                ))} */}
                {
         appliedHouses.map(house => (
            <tr key={house.id}>
                 <td>{house.house_id}</td>
                <td>{house.tenant_status}</td>
             <td>
                {house.tenant_status === 'approved' ? (
                <button className='btn btn-success' onClick={() => handleSignNow(house.id)} >Sign Now</button>
        ) : (
                <button className='btn btn-danger' onClick={() => handleCancel(house.id)}>Cancel Application</button>
        )}
           {/* <button className='btn btn-primary '>Sign Now</button> */}
            </td>
    </tr>
  ))
}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
