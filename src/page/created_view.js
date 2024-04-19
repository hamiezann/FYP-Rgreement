import React, { useState } from 'react';
import { ethers } from 'ethers';
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import '../style/contract.css';

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function ContractDetails() {
  const [contractId, setContractId] = useState('');
  const [contractDetails, setContractDetails] = useState(null);

  const fetchContractDetails = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const contract = new ethers.Contract(
        contractAddress,
        HouseRentalContract.abi,
        provider
      );

      // Fetch contract details for the provided contract ID
      const details = await contract.getContract(contractId);
      setContractDetails(details);
    } catch (error) {
      console.error('Error fetching contract details:', error);
      alert('An error occurred while fetching contract details. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>View Contract Details</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        fetchContractDetails();
      }}>
        <label htmlFor="contractId">Contract ID:</label>
        <input
          type="text"
          id="contractId"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          required
        />
        <button type="submit">View Details</button>
      </form>
      {contractDetails && (
  <div className="contract-details">
    <h3>Contract Details</h3>
    <p>Creation Date: {new Date(Number(contractDetails.creationDate) * 1000).toLocaleDateString()}</p>

    
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
    <p>Effective Date: {new Date(Number(contractDetails.houseDetails.effectiveDate) * 1000).toLocaleDateString()}</p>
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
  </div>
)}

    </div>
  );
}

export default ContractDetails;
