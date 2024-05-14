import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import "../../style/landlord/house_contract_details.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const HouseContractDetails = () => {
  const { houseId } = useParams();
  const [contractDetails, setContractDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const uniIdentifier = location.state.uniIdentifier;
  const fixedPassword = "123456";
  const navigate = useNavigate();

  const handleUpdate = (uniIdentifier) => {
    navigate(`/rental-contract-update`, { state: { uniIdentifier } });
  };

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const contract = new ethers.Contract(
          contractAddress,
          HouseRentalContract.abi,
          provider
        );
        const details = await contract.getContract(uniIdentifier, fixedPassword);
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
    <div className="container mt-5">
      <div className="document p-4">
        <div className="text-center mb-4">
          <h2>House Rental Contract Details</h2>
        </div>
        <div className="section mb-4">
          <h4>Landlord Information</h4>
          <p><strong>Name:</strong> {contractDetails.landlord.name}</p>
          <p><strong>Identification Number:</strong> {contractDetails.landlord.identificationNumber}</p>
          <p><strong>House Address:</strong> {contractDetails.landlord.house_address}</p>
        </div>

        <div className="section mb-4">
          <h4>Tenant Information</h4>
          <p><strong>Name:</strong> {contractDetails.tenant.name}</p>
          <p><strong>Identification Number:</strong> {contractDetails.tenant.identificationNumber}</p>
          <p><strong>House Address:</strong> {contractDetails.tenant.house_address}</p>
        </div>

        <div className="section mb-4">
          <h4>House Details</h4>
          <p><strong>Rent Address:</strong> {contractDetails.houseDetails.rent_address}</p>
          <p><strong>Building Type:</strong> {contractDetails.houseDetails.buildingType}</p>
          <p><strong>Rent Period:</strong> {Number(contractDetails.houseDetails.rentPeriod)}</p>
          <p><strong>Effective StartDate:</strong> {new Date(Number(contractDetails.houseDetails.effectiveStartDate) * 1000).toLocaleDateString()}</p>
          <p><strong>Effective End Date:</strong> {new Date(Number(contractDetails.houseDetails.effectiveEndDate) * 1000).toLocaleDateString()}</p>
          <p><strong>Monthly Rent:</strong> {Number(contractDetails.houseDetails.monthlyRent)}</p>
          <p><strong>Payment Method:</strong> {contractDetails.houseDetails.paymentMethod}</p>
          <p><strong>Max Overdue Period:</strong> {Number(contractDetails.houseDetails.maxOverduePeriod)}</p>
          <p><strong>Deposit:</strong> {Number(contractDetails.houseDetails.deposit)}</p>
          <p><strong>Utility Deposit:</strong> {Number(contractDetails.houseDetails.utilityDeposit)}</p>
          <p><strong>Advance Rental:</strong> {Number(contractDetails.houseDetails.advanceRental)}</p>
        </div>

        <div className="section mb-4">
          <h4>Agreement Details</h4>
          <p>{contractDetails.agreementDetails}</p>
        </div>

        <div className="section mb-4">
          <h4>Tenant Agreements</h4>
          <ul>
            {contractDetails.tenantAgreements.map((agreement, index) => (
              <li key={index}>{agreement}</li>
            ))}
          </ul>
        </div>

        <div className="section mb-4">
          <h4>Landlord Responsibilities</h4>
          <ul>
            {contractDetails.landlordResponsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>

        <div className="section mb-4">
          <h4>Agreements Between Landlord</h4>
          <ul>
            {contractDetails.agreementsBetweenLandlord.map((agreement, index) => (
              <li key={index}>{agreement}</li>
            ))}
          </ul>
        </div>

        <div className="section mb-4">
          <p><strong>Landlord Signature:</strong> {contractDetails.landlordSignature}</p>
          <p><strong>Tenant Signature:</strong> {contractDetails.tenantSignature}</p>
        </div>

        <div className="text-center mt-4">
          {contractDetails.tenantSignature ? (
            <button className="btn btn-primary">Print</button>
          ) : (
            <button className="btn btn-secondary" onClick={() => handleUpdate(uniIdentifier)}>Update</button>
          )}
          <button className="btn btn-outline-secondary ml-2" type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default HouseContractDetails;
