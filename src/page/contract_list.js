// ContractList.js
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import RentalContract from '../artifacts/contracts/RentalContract.sol/RentalContract.json';
import '../style/contract.css';

const rentalContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function ContractList() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const contract = new ethers.Contract(
          rentalContractAddress,
          RentalContract.abi,
          provider
        );

        // Fetch all contracts
        const totalContracts = await contract.getTotalContracts();

        // Retrieve details of each contract
        const contractDetails = [];
        for (let i = 0; i < totalContracts; i++) {
          const details = await contract.getContract(i);
          contractDetails.push(details);
        }

        setContracts(contractDetails);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        alert('An error occurred while fetching contracts. Please try again.');
      }
    }

    fetchContracts();
  }, []);

  async function viewContractDetails(contract) {
    // You can implement the logic to display contract details in a modal or another page
    console.log('Viewing contract details:', contract);
  }

  return (
    <div className="container">
      <h2 className="contract-title">List of Rental Contracts</h2>
      {contracts.length === 0 ? (
        <p>No contracts available</p>
      ) : (
        <ul>
          {contracts.map((contract, index) => (
            <li key={index}>
              <p>Party Name: {contract.party}</p>
              <p>Land Address: {contract.land_address}</p>
              <p>Rent Fee: {contract.rentFee}</p>
              <button onClick={() => viewContractDetails(contract)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContractList;
