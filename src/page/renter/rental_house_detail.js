// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../style/renter/rental_house_detail.css";

// const HouseDetailPage = () => {
//   const { houseId } = useParams();
//   const [houseDetails, setHouseDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHouseDetails = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
//         console.log("Response data:", response.data); 
//         setHouseDetails(response.data[0]); // Accessing the first element
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching house details:", error);
//         setError(error);
//         setIsLoading(false);
//       }
//     };

//     fetchHouseDetails();
//   }, [houseId]);

//   if (isLoading) {
//     return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
//   }

//   if (error || !houseDetails) {
//     return <div className="alert alert-danger" role="alert">Error: Failed to fetch house details</div>;
//   }

//   console.log("houseDetails:", houseDetails);

//   const handleApplyNow = (houseId) => {
//     navigate(`/apply-house/${houseId}`);
//   };

//   return (
//     <div className="container mt-5 mb-5">
//       <div className="row">
//         <div className="col-md-6">
//           <div className="product-image-container">
//           <img src={houseDetails.images[0].url} className="card-img-top" alt="Property" />
//             {/* <img src="/dummy.png" className="img-fluid" alt="House" /> */}
            
//           </div>
//         </div>
//         <div className="col-md-6">
//           <h2>House Details</h2>
//           <ul className="list-group list-group-flush">
//           <li className="list-group-item"><strong>Rent Fee:</strong> RM{houseDetails.rent_fee}</li>
//             <li className="list-group-item"><strong>Preferred Occupants:</strong> {houseDetails.prefered_occupants}</li>
//             <li className="list-group-item"><strong>Type of House:</strong> {houseDetails.type_of_house}</li>
//             <li className="list-group-item"><strong>Description:</strong> {houseDetails.description}</li>
//             <li className="list-group-item"><strong>Amenities:</strong> {houseDetails.amenities}</li>
//             <li className="list-group-item"><strong>Number of Rooms:</strong> {houseDetails.number_of_rooms}</li>
//             <li className="list-group-item"><strong>Number of Bedrooms:</strong> {houseDetails.num_bedrooms}</li>
//             <li className="list-group-item"><strong>Number of Toilet:</strong> {houseDetails.num_toilets}</li>
//           </ul>
//           <div className="mt-3">
//             <button className="btn btn-primary me-2">Chat Now</button>
//             <button className="btn btn-success" onClick={() => handleApplyNow(houseId)}>Apply</button>
//           </div>
//         </div>
//       </div>
//       <div className="extra-space"></div>
//     </div>
//   );
// };

// export default HouseDetailPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../../style/renter/rental_house_detail.css";

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const [houseDetails, setHouseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/house-details/${houseId}`);
        console.log('Response data:', response.data);
        setHouseDetails(response.data[0]); // Accessing the first element
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching house details:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !houseDetails) {
    return <div className="alert alert-danger" role="alert">Error: Failed to fetch house details</div>;
  }

  const handleApplyNow = (houseId) => {
    navigate(`/apply-house/${houseId}`);
  };

  return (
    <div className="house-detail-container">
      
      <div className="image-section">
        <img src={houseDetails.images[0].url} alt="Property" className="house-image" />
      </div>
      <div className="details-section">
      <span className="badge">HOT RENTAL</span>

        <h1>House Details</h1>
        <p className="category">RENTAL HOUSE | ⭐⭐⭐⭐⭐ 4.9 (2130 reviews)</p>
        <p className='description'>{houseDetails.description}</p>
        <ul className="features">
          <li>Rent Fee: RM{houseDetails.rent_fee}</li>
          <li>Preferred Occupants: {houseDetails.prefered_occupants}</li>
          <li>Type of House: {houseDetails.type_of_house}</li>
          {/* <li><strong>Description:</strong> {houseDetails.description}</li> */}
          <li>Amenities: {houseDetails.amenities}</li>
          <li>Number of Rooms: {houseDetails.number_of_rooms}</li>
          <li>Number of Bedrooms: {houseDetails.num_bedrooms}</li>
          <li>Number of Toilet: {houseDetails.num_toilets}</li>
        </ul>
        <div className="actions">
          <button className="chat-now-button">Chat Now</button>
          <button className="apply-button" onClick={() => handleApplyNow(houseId)}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default HouseDetailPage;
