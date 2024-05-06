import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {ethers} from 'ethers';
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const HouseContractDetails = () => {
  const { houseId } = useParams();
  const [contractDetails, setContractDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const uniIdentifier = location.state.uniIdentifier;
  const fixedPassword = "123456";
  const navigate = useNavigate(); // Initialize useHistory

  const handleUpdate = (uniIdentifier) => {
    navigate(`/rental-contract-update`, { state: { uniIdentifier } });
  };

  useEffect(() => {
    const fetchContractDetails = async () => {
        //console.log('Uni Identifier:', uniIdentifier);
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/contract-details/${houseId}`);
        // setContractDetails(response.data);
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const contract = new ethers.Contract(
            contractAddress,
            HouseRentalContract.abi,
            provider
        );
        const details = await contract.getContract(uniIdentifier,fixedPassword);
        setContractDetails(details);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchContractDetails();
  }, [uniIdentifier]);

  if (isLoading) {
    return <p>Loading contract details...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
   
   <h4>Landlord Information:</h4>
    <p>Name: {contractDetails.landlord.name}</p>
    <p>Identification Number: {contractDetails.landlord.identificationNumber}</p>
    <p>House Address: {contractDetails.landlord.house_address}</p>
    
    <h4>Tenant Information:</h4>
    <p>Name: {contractDetails.tenant.name}</p>
    <p>Identification Number: {contractDetails.tenant.identificationNumber}</p>
    <p>House Address: {contractDetails.tenant.house_address}</p>
    
    <h4>House Details:</h4>
    <p>Rent Address: {contractDetails.houseDetails.rent_address}</p>
    <p>Building Type: {contractDetails.houseDetails.buildingType}</p>
    <p>Rent Period: {Number(contractDetails.houseDetails.rentPeriod)}</p>
    <p>Effective StartDate: {new Date(Number(contractDetails.houseDetails.effectiveStartDate) * 1000).toLocaleDateString()}</p>
    <p>Effective End Date: {new Date(Number(contractDetails.houseDetails.effectiveEndDate) * 1000).toLocaleDateString()}</p>
    <p>Monthly Rent: {Number(contractDetails.houseDetails.monthlyRent)}</p>
    <p>Payment Method: {contractDetails.houseDetails.paymentMethod}</p>
    <p>Max Overdue Period: {Number(contractDetails.houseDetails.maxOverduePeriod)}</p>
    <p>Deposit: {Number(contractDetails.houseDetails.deposit)}</p>
    <p>Utility Deposit: {Number(contractDetails.houseDetails.utilityDeposit)}</p>
    <p>Advance Rental: {Number(contractDetails.houseDetails.advanceRental)}</p>
    
    <h4>Agreement Details:</h4>
    <p>{contractDetails.agreementDetails}</p>
    
    <h4>Tenant Agreements:</h4>
    <ul>
      {contractDetails.tenantAgreements.map((agreement, index) => (
        <li key={index}>{agreement}</li>
      ))}
    </ul>
    
    <h4>Landlord Responsibilities:</h4>
    <ul>
      {contractDetails.landlordResponsibilities.map((responsibility, index) => (
        <li key={index}>{responsibility}</li>
      ))}
    </ul>
    
    <h4>Agreements Between Landlord:</h4>
    <ul>
      {contractDetails.agreementsBetweenLandlord.map((agreement, index) => (
        <li key={index}>{agreement}</li>
      ))}
    </ul>
    
    <p>Landlord Signature: {contractDetails.landlordSignature}</p>
    <p>Tenant Signature: {contractDetails.tenantSignature}</p>
    {/* Display other contract details */}


    <button className="update-button" onClick={() => handleUpdate(uniIdentifier)}>Update</button>
    <button type="button" onClick={() => navigate(-1)}>Back</button>
  </div>
  );
};

export default HouseContractDetails;
