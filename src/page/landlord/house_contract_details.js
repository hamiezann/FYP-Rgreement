// import React, { useState, useEffect } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { ethers } from 'ethers';
// // import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
// import HouseRentalContract from "../../HostedAbi/HouseRentalContract.json";
// import "../../style/landlord/house_contract_details.css";

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// const HouseContractDetails = () => {
//   const { houseId } = useParams();
//   const [contractDetails, setContractDetails] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();
//   const uniIdentifier = location.state.uniIdentifier;
//   const fixedPassword = "123456";
//   const role = localStorage.getItem('role');
//   const navigate = useNavigate();
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [remainingdepositAmount, remainingsetDepositAmount] = useState(null);

//   const handleUpdate = (uniIdentifier) => {
//     navigate(`/rental-contract-update`, { state: { uniIdentifier } });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   useEffect(() => {
//     const fetchContractDetails = async () => {
//       try {
//         // const provider = new ethers.JsonRpcProvider('http://localhost:8545');
//         const provider = new ethers.JsonRpcProvider('http://172.24.211.6:8545');
//         const contract = new ethers.Contract(
//           contractAddress,
//           HouseRentalContract.abi,
//           provider
//         );
//         const details = await contract.getContract(uniIdentifier, fixedPassword);
//        setContractDetails(details);
//        const contractDetails = await contract.contracts(uniIdentifier);
//        const depositAmountWei = contractDetails.houseDetails.deposit;
//        const depositAmountEther = ethers.formatEther(depositAmountWei); // Convert wei to ether
//        setDepositAmount(depositAmountEther);
       
//        const remainingdepositAmountWei = contractDetails.remainingDeposit;
//        const remainingdepositAmountEther = ethers.formatEther(remainingdepositAmountWei); // Convert wei to ether
//        remainingsetDepositAmount(remainingdepositAmountEther);

//         setIsLoading(false);
//      //  console.log("deposit in eth", depositInEth);
//       } catch (error) {
//         console.error("Error fetching contract details:", error);
//         setError(error);
//         setIsLoading(false);
//       }
//     };

//     fetchContractDetails();
//   }, [uniIdentifier]);

//   if (isLoading) {
//     return <p>Loading contract details...</p>;
//   }

//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div className="container-contract-detail">
//       <div className="document p-4">
//         <div className="logo-container">
//           <img src="/newlogo2.png" alt="Logo" className="logo" />
//         </div>
//         <div className="receipt-header text-center mb-4">
//           <h2>House Rental Contract Details</h2>
//         </div>
//         <div className="section mb-4">
//           <h4>Landlord Information</h4>
//           <p><strong>Name:</strong> {contractDetails.landlord.name}</p>
//           <p><strong>Identification Number:</strong> {contractDetails.landlord.identificationNumber}</p>
//           <p><strong>House Address:</strong> {contractDetails.landlord.house_address}</p>
//         </div>

//         <div className="section mb-4">
//           <h4>Tenant Information</h4>
//           <p><strong>Name:</strong> {contractDetails.tenant.name}</p>
//           <p><strong>Identification Number:</strong> {contractDetails.tenant.identificationNumber}</p>
//           <p><strong>House Address:</strong> {contractDetails.tenant.house_address}</p>
//         </div>

//         <div className="section mb-4">
//           <h4>House Details</h4>
//           <p><strong>Rent Address:</strong> {contractDetails.houseDetails.rent_address}</p>
//           <p><strong>Building Type:</strong> {contractDetails.houseDetails.buildingType}</p>
//           <p><strong>Rent Period:</strong> {Number(contractDetails.houseDetails.rentPeriod)}</p>
//           <p><strong>Effective Start Date:</strong> {new Date(Number(contractDetails.houseDetails.effectiveStartDate) * 1000).toLocaleDateString()}</p>
//           <p><strong>Effective End Date:</strong> {new Date(Number(contractDetails.houseDetails.effectiveEndDate) * 1000).toLocaleDateString()}</p>
//           <p><strong>Monthly Rent:</strong> {Number(contractDetails.houseDetails.monthlyRent)}</p>
//           <p><strong>Payment Method:</strong> {contractDetails.houseDetails.paymentMethod}</p>
//           <p><strong>Max Overdue Period:</strong> {Number(contractDetails.houseDetails.maxOverduePeriod)}</p>
//           <p><strong>Deposit:</strong> {depositAmount} ETH</p>
//         </div>

//         <div className="section mb-4">
//           <h4>Agreement Details</h4>
//           <p>{contractDetails.agreementDetails}</p>
//         </div>

//         <div className="section mb-4">
//           <h4>Tenant Agreements</h4>
//           <ul>
//             {contractDetails.tenantAgreements.map((agreement, index) => (
//               <li key={index}>{agreement}</li>
//             ))}
//           </ul>
//         </div>

//         <div className="section mb-4">
//           <h4>Landlord Responsibilities</h4>
//           <ul>
//             {contractDetails.landlordResponsibilities.map((responsibility, index) => (
//               <li key={index}>{responsibility}</li>
//             ))}
//           </ul>
//         </div>

//         <div className="section mb-4">
//           <h4>Agreements Between Landlord</h4>
//           <ul>
//             {contractDetails.agreementsBetweenLandlord.map((agreement, index) => (
//               <li key={index}>{agreement}</li>
//             ))}
//           </ul>
//         </div>

//         <div className="section mb-4">
//           <p><strong>Landlord Signature:</strong> {contractDetails.landlordSignature}</p>
//           <p><strong>Tenant Signature:</strong> {contractDetails.tenantSignature}</p>
//         </div>

//         <div className="section mb-4">
//           <h4>Contract Status</h4>
//           <p>{contractDetails.contractActive ? "Active" : "Not Active"}</p>
//           <p><strong>Remaining Deposit:</strong> {remainingdepositAmount} ETH</p>
//         </div>
    

//         <div className="text-center mt-4">
//           {(role === 'landlord' || contractDetails.tenantSignature) && (
//             <div className='btn-container-chat'>
//               <button className="btn-my-property-sign-now" onClick={handlePrint}>Print</button>
//             </div>
//           )}
//           {role === 'landlord' && !contractDetails.tenantSignature && (
//             <div className='btn-container-details'>
//               <button className="btn-my-property-sign-now" type="button" onClick={() => handleUpdate(uniIdentifier)}>Update</button>
//             </div>
//           )}
//           <div className='btn-container-back'>
//             <button className="btn-my-property-sign-now" type="button" onClick={() => navigate(-1)}>Back</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HouseContractDetails;

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
// import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import HouseRentalContract from "../../HostedAbi/HouseRentalContract.json";
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
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState(null);
  const [remainingdepositAmount, remainingsetDepositAmount] = useState(null);

  const handleUpdate = (uniIdentifier) => {
    navigate(`/rental-contract-update`, { state: { uniIdentifier } });
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            HouseRentalContract.abi,
            signer
          );

          const details = await contract.getContract(uniIdentifier, fixedPassword);
          setContractDetails(details);

          const contractDetails = await contract.contracts(uniIdentifier);
          const depositAmountWei = contractDetails.houseDetails.deposit;
          const depositAmountEther = ethers.formatEther(depositAmountWei); // Convert wei to ether
          setDepositAmount(depositAmountEther);

          const remainingdepositAmountWei = contractDetails.remainingDeposit;
          const remainingdepositAmountEther = ethers.formatEther(remainingdepositAmountWei); // Convert wei to ether
          remainingsetDepositAmount(remainingdepositAmountEther);

          setIsLoading(false);
        } else {
          console.error("MetaMask is not installed");
          setError(new Error("MetaMask is not installed"));
          setIsLoading(false);
        }
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
    <div className="container-contract-detail">
      <div className="document p-4">
        <div className="logo-container">
          <img src="/newlogo2.png" alt="Logo" className="logo" />
        </div>
        <div className="receipt-header text-center mb-4">
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
          <p><strong>Effective Start Date:</strong> {new Date(Number(contractDetails.houseDetails.effectiveStartDate) * 1000).toLocaleDateString()}</p>
          <p><strong>Effective End Date:</strong> {new Date(Number(contractDetails.houseDetails.effectiveEndDate) * 1000).toLocaleDateString()}</p>
          <p><strong>Monthly Rent:</strong> {Number(contractDetails.houseDetails.monthlyRent)}</p>
          <p><strong>Payment Method:</strong> {contractDetails.houseDetails.paymentMethod}</p>
          <p><strong>Max Overdue Period:</strong> {Number(contractDetails.houseDetails.maxOverduePeriod)}</p>
          <p><strong>Deposit:</strong> {depositAmount} ETH</p>
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

        <div className="section mb-4">
          <h4>Contract Status</h4>
          <p>{contractDetails.contractActive ? "Active" : "Not Active"}</p>
          <p><strong>Remaining Deposit:</strong> {remainingdepositAmount} ETH</p>
        </div>

        <div className="text-center mt-4">
          {(role === 'landlord' || contractDetails.tenantSignature) && (
            <div className='btn-container-chat'>
              <button className="btn-my-property-sign-now" onClick={handlePrint}>Print</button>
            </div>
          )}
          {role === 'landlord' && !contractDetails.tenantSignature && (
            <div className='btn-container-details'>
              <button className="btn-my-property-sign-now" type="button" onClick={() => handleUpdate(uniIdentifier)}>Update</button>
            </div>
          )}
          <div className='btn-container-back'>
            <button className="btn-my-property-sign-now" type="button" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseContractDetails;
