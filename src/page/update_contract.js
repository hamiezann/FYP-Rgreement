import React, { useState } from "react";
import { ethers } from "ethers";
import "../style/contract.css";
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useGlobalContractState } from "./globally_use_variable.js/variable";

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const contractAbi = HouseRentalContract.abi;
const fixedPassword = "123456";
const UpdateContractForm = () => {

    const [contractId, setContractId] = useState("");
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
        landlordResponsibilities,
        setLandlordResponsibilities,
        agreementBetweenLandlord,
        setAgreementBetweenLandlord,
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
        numberOfRooms,
        setNumberOfRooms,
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
                    <div className="row">
                        <div className="col-25">
                            <label>Contract ID:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={contractId} onChange={(e) => setContractId(e.target.value)} required />
                        </div>
                    </div>
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
                                <textarea
                                    value={agreement}
                                   onChange={e => handleTenantAgreementChange(index, e.target.value)}
                                    
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveTenantAgreement(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddTenantAgreement}>Add Tenant Agreement</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Landlord Responsibilities:</label>
                    </div>
                    <div className="col-75">
                        {landlordResponsibilities.map((responsibility, index) => (
                            <div key={index}>
                                <textarea
                                    value={responsibility}
                                    onChange={e => handleLandlordResponsibilityChange(index, e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveLandlordResponsibility(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddLandlordResponsibility}>Add Landlord Responsibility</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Agreements Between Landlord:</label>
                    </div>
                    <div className="col-75">
                        {agreementBetweenLandlord.map((agreement, index) => (
                            <div key={index}>
                                <textarea
                                    value={agreement}
                                 onChange={e => handleAgreementBetweenLandlordChange(index, e.target.value)}
                                 
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveAgreementBetweenLandlord(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddAgreementBetweenLandlord}>Add Agreement Between Landlord</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Landlord Signature:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={landlordSignature} onChange={(e) => setLandlordSignature(e.target.value)} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Tenant Signature:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={tenantSignature} onChange={(e) => setTenantSignature(e.target.value)} required />
                    </div>
                </div>


             


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

export default UpdateContractForm;
