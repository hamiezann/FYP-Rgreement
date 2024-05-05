import React, { useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../../style/contract.css"
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useGlobalContractState } from "../globally_use_variable.js/variable";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;
const fixedPassword = "123456";
const UpdateHouseContractForm = () => {

    //const [contractId, setContractId] = useState("");
    
    const {
        landlord,setLandlord,
        identificationNumber,setIdentificationNumber,
        houseAddress,setHouseAddress,
        hasTenant,setHasTenant,
        tenantName, setTenantName,
        tenantIdNumber, setTenantIdNumber,
        tenantHouseAddress,setTenantHouseAddress,
    
        rentAddress,
        setRentAddress,
        rentLatitude,
        setLatitude,
        rentLongitude,
        setLongitude,
        rentPeriod,
        setRentPeriod,
        customRentPeriod,
        setCustomRentPeriod,
        effectiveDate,
        setEffectiveDate,
        monthlyRent,
        setMonthlyRent,
        paymentMethod,
        setPaymentMethod,
        maxOverduePeriod,
        setMaxOverduePeriod,
        customMaxOverduePeriod,
        setCustomMaxOverduePeriod,
        deposit,
        setDeposit,
        utilityDeposit,
        setUtilityDeposit,
        advanceRental,
        setAdvanceRental,
        agreementDetails,
        setAgreementDetails,
        tenantAgreement,
        setTenantAgreement,
        newTenantAgreement,
        setNewTenantAgreement,
        landlordResponsibilities,
        setLandlordResponsibilities,
        newLandlordResponsibilites,
        setNewLandlordResponsibilities,
        agreementBetweenLandlord,
        setAgreementBetweenLandlord,
        newAgreementBetweenLandlord,
        setNewAgreementBetweenLandlord,
        landlordSignature,
        setLandlordSignature,
        tenantSignature,
        setTenantSignature,
        isLoading,
        setIsLoading,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        buildingType,
        setBuildingType,
        preferredOccupants,
        setPreferredOccupants,
        // numberOfRooms,
        // setNumberOfRooms,
        description,
        setDescription,
        
    
        handlePaymentMethodChange,
        handleBuildingTypeChange,
        handleRentPeriodChange,
        handleMaxOverduePeriodChange,
        handleCheckboxChange,
        handleAddTenantAgreement,
        handleRemoveTenantAgreement,
        handleTenantAgreementChange,
        handleAddLandlordResponsibility,
        handleRemoveLandlordResponsibility,
        handleLandlordResponsibilityChange,
        handleAddAgreementBetweenLandlord,
        handleRemoveAgreementBetweenLandlord,
        handleAgreementBetweenLandlordChange,
        userId, setUserId,
        } = useGlobalContractState();

    const tenantAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
    const landlordAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
    const agreementBetweenLandlordOptions = ['Option 1', 'Option 2', 'Option 3'];

    const location = useLocation();
    const uniIdentifier = location.state.uniIdentifier;
    const contractId = uniIdentifier;
    const generateLandlordSignature = async () => {
        // Implement signature generation logic here
        // This could involve cryptographic libraries or Ethereum wallet integration
        // For demonstration purposes, let's assume a simple message signing using MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const signature = await signer.signMessage("You are signing this as a sign you agree with all the terms in the contract.");
        setLandlordSignature(signature);
    };
     console.log('Uni Identifier:', uniIdentifier);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const tx = await contract.updateContract(
                contractId,
                fixedPassword,
                agreementDetails,
                tenantAgreement,
                landlordResponsibilities,
                agreementBetweenLandlord,
                landlordSignature,
                tenantSignature
               
            );

            await tx.wait();
            setIsLoading(false);
            setSuccessMessage("Contract updated successfully!");
        } catch (error) {
            console.error("Error updating contract:", error);
            setIsLoading(false);
            setErrorMessage("An error occurred while updating the contract. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="title-container">
                <h2>UPDATE CONTRACT FORM</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    {/* <div className="row">
                        <div className="col-25">
                            <label>Contract ID:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={contractId} onChange={(e) => setContractId(e.target.value)} required />
                        </div>
                    </div> */}
                    {/* Add other fields for updating contract details */}
                    <div className="row">
                    <div className="col-25">
                        <label>Agreement Details:</label>
                    </div>
                    <div className="col-75">
                        <textarea value={agreementDetails} onChange={(e) => setAgreementDetails(e.target.value)} required />
                    </div>
                </div>
     <div className="row">
        <div className="col-25">
          <label>Tenant Agreements:</label>
        </div>
        <div className="col-75">
          {tenantAgreement.map((agreement, index) => (
            <div key={index}>
              {/* <textarea
                value={agreement}
                onChange={(e) => handleTenantAgreementChange(index, e.target.value)}
                required
              /> */}
              {agreement}
              {agreement && (
              <button type="button" onClick={() => handleRemoveTenantAgreement(index)}>Remove</button>
              )}
              </div>
          ))}
          <div>
            <select value={newTenantAgreement} onChange={(e) => setNewTenantAgreement(e.target.value)}>
              <option value="">Select an option...</option>
              {tenantAgreementOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <button type="button" onClick={handleAddTenantAgreement}>Add Tenant Agreement</button>
          </div>
        </div>
      </div>

                {/* Add Landlord Responsibilities */}
                <div className="row">
                    <div className="col-25">
                        <label>Landlord Responsibilities:</label>
                    </div>
                    <div className="col-75">
                        {landlordResponsibilities.map((responsibility, index) => (
                            <div key={index}>
                                {/* <textarea
                                    value={responsibility}
                                    onChange={e => handleLandlordResponsibilityChange(index, e.target.value)}
                                    required
                                /> */}
                                {responsibility}
                                {responsibility && (
                                <button type="button" onClick={() => handleRemoveLandlordResponsibility(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        <div>
                            <select value={newLandlordResponsibilites} onChange={(e) => setNewLandlordResponsibilities(e.target.value)}>
                                <option value="">Select an option...</option>
                                {landlordAgreementOptions.map((option, index) =>(
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            <button type="button" onClick={handleAddLandlordResponsibility}>Add Landlord Responsibility</button>

                        </div>
                    </div>
                </div>

                {/* Add Agreements Between Landlord */}
                <div className="row">
                    <div className="col-25">
                        <label>Agreements Between Landlord:</label>
                    </div>
                    <div className="col-75">
                        {agreementBetweenLandlord.map((agreement, index) => (
                            <div key={index}>
                                {/* <textarea
                                    value={agreement}
                                 onChange={e => handleAgreementBetweenLandlordChange(index, e.target.value)}
                                 
                                    required
                                /> */}
                                {agreement}
                                {agreement && (
                                <button type="button" onClick={() => handleRemoveAgreementBetweenLandlord(index)}>Remove</button>

                                )}
                            </div>
                        ))}
                        <div>
                            <select value={newAgreementBetweenLandlord} onChange={(e) =>setNewAgreementBetweenLandlord(e.target.value)}>
                                <option value="">Select an option...</option>
                                {agreementBetweenLandlordOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            <button type="button" onClick={handleAddAgreementBetweenLandlord}>Add Agreement Between Landlord</button>

                        </div>
                    </div>
                </div>
                <div className="row">
                        <div className="col-25">
                            <label>Landlord Signature:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={landlordSignature} readOnly />
                            <button onClick={generateLandlordSignature}>Generate Signature</button>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-25">
                            <label>Tenant Signature:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={tenantSignature} onChange={(e) => setTenantSignature(e.target.value)} required />
                        </div>
                    </div> */}

                


             


                </div>
                <div className="button-container">
                    <input type="submit" value="Update Contract" />
                </div>
                {isLoading && <p>Loading...</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default UpdateHouseContractForm;
