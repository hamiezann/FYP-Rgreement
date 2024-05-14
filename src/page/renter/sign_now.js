import React, { useState } from "react";
import { ethers } from "ethers";
import { useLocation } from 'react-router-dom'; 
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;
const fixedPassword = "123456";

const SignContractForm = () => {
  const location = useLocation();
  const uniqueIdentifier = location.state?.uniqueIdentifier; 
  const contractId = uniqueIdentifier;
  const [name, setName] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [tenantSignature, setTenantSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      const tx = await contract.signContract(
        contractId,
        fixedPassword,
        name,
        identificationNumber,
        houseAddress,
        tenantSignature
      );

      await tx.wait();
      setIsLoading(false);
      setSuccessMessage("Contract signed successfully!");
    } catch (error) {
      console.error("Error signing contract:", error);
      setIsLoading(false);
      setErrorMessage("An error occurred while signing the contract. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="title-container">
        <h2>SIGN CONTRACT FORM</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="row">
            <div className="col-25">
              <label>Contract ID:</label>
            </div>
            <div className="col-75">
              <textarea value={contractId} readOnly />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label>Name:</label>
            </div>
            <div className="col-75">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label>Identification Number:</label>
            </div>
            <div className="col-75">
              <input type="text" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label>House Address:</label>
            </div>
            <div className="col-75">
              <input type="text" value={houseAddress} onChange={(e) => setHouseAddress(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label>Tenant Signature:</label>
            </div>
            <div className="col-75">
              <input type="text" value={tenantSignature} readOnly />
              <button type="button" onClick={generateTenantSignature}>Generate Signature</button>
            </div>
          </div>
        </div>
        <div className="button-container">
          <input type="submit" value="Sign Contract" />
        </div>
        {isLoading && <p>Loading...</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SignContractForm;
