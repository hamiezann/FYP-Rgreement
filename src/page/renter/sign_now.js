import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useLocation, useNavigate } from 'react-router-dom'; 
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignContractForm.css'; // Import the standard CSS file

const contractAbi = HouseRentalContract.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const fixedPassword = "123456";

const SignContractForm = () => {
  const location = useLocation();
  const uniqueIdentifier = location.state?.uniqueIdentifier; 
  const houseId = location.state?.houseId; 
  const contractId = uniqueIdentifier; // Use the uniqueIdentifier directly as contractId
  const [name, setName] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [tenantSignature, setTenantSignature] = useState("");
  const [depositAmount, setDepositAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepositAmount = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        // Retrieve the deposit amount from the contract
        const contractDetails = await contract.contracts(contractId);
        const depositAmountWei = contractDetails.houseDetails.deposit;
        const depositAmountEther = ethers.formatEther(depositAmountWei); // Convert wei to ether
        
        setDepositAmount(depositAmountEther);
      } catch (error) {
        console.error("Error fetching deposit amount:", error);
        setErrorMessage("An error occurred while fetching the deposit amount. Please try again.");
      }
    };

    if (contractId) {
      fetchDepositAmount();
    }
  }, [contractId]);

  const generateTenantSignature = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage("You are signing this as a sign you agree with all the terms in the contract.");
      setTenantSignature(signature);
    } catch (error) {
      console.error("Error generating tenant signature:", error);
      setErrorMessage("An error occurred while generating the signature. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // Convert deposit amount back to wei for the transaction
      const depositAmountWei = ethers.parseEther(depositAmount);

      const tx = await contract.signContract(
        contractId,
        fixedPassword,
        name,
        identificationNumber,
        houseAddress,
        tenantSignature,
        { value: depositAmountWei }
      );

      await tx.wait();
      setIsLoading(false);
      setSuccessMessage("Contract signed successfully!");

      const response = await axios.put(`http://127.0.0.1:8000/api/sign-now/${houseId}`, { sign_contract_status: 'Signed' , contract_status: 'Active'});
      console.log(response.data); 
    } catch (error) {
      console.error("Error signing contract:", error);
      setIsLoading(false);
      setErrorMessage("An error occurred while signing the contract. Please try again.");
    }
  };

  return (
    // <div className="container-sign-now">
    <div className="contract-container">
    <div className="form-container-sign-now">
  
      <div className="title-container">
                <h2 className="title-container-contract">SIGN CONTRACT FORM</h2>
            </div>
      {depositAmount !== null && (
  <Alert variant="info" className="eth-alert">
    <img src='https://i.postimg.cc/T1F1K0bW/Ethereum.png' alt="ETH Icon" className="eth-icon" />
    {depositAmount} ETH
  </Alert>
)}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formContractId" className="mb-3">
          <Form.Label>Contract ID</Form.Label>
          <Form.Control as="textarea" value={contractId} readOnly className="form-control" />
        </Form.Group>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formIdentificationNumber" className="mb-3">
          <Form.Label>Identification Number</Form.Label>
          <Form.Control 
            type="text" 
            value={identificationNumber} 
            onChange={(e) => setIdentificationNumber(e.target.value)} 
            required 
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formHouseAddress" className="mb-3">
          <Form.Label>House Address</Form.Label>
          <Form.Control 
            type="text" 
            value={houseAddress} 
            onChange={(e) => setHouseAddress(e.target.value)} 
            required 
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formTenantSignature" className="mb-3">
          <Form.Label>Tenant Signature</Form.Label>
          <div className="d-flex">
            <Form.Control 
              type="text" 
              value={tenantSignature} 
              readOnly 
              className="me-2 form-control"
            />
            {/* <Button variant="outline-secondary" onClick={generateTenantSignature}>
              Generate Signature
            </Button> */}
            <div className='btn-container-details'>
                  <button className="btn-my-property-sign-now"onClick={generateTenantSignature}>Generate Signature</button>
          </div>
          </div>
        </Form.Group>
        <div className="d-flex justify-content-between">
          {/* <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button> */}
          <div className='btn-container-cancel'>
                  <button className="btn-my-property-sign-now" onClick={() => navigate(-1)}>Cancel</button>
          </div>
          {/* <Button variant="primary" type="submit">
            {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Contract"}
          </Button> */}
          <div className='btn-container-chat'>
                  <button className="btn-my-property-sign-now"  variant="primary" type="submit">
                  {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Contract"}
                  </button>
          </div>
        </div>
        {successMessage && <p className="text-success mt-3">{successMessage}</p>}
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      </Form>
    </div>
    </div>
  );
};

export default SignContractForm;
