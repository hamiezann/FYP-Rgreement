import React, { useState } from "react";
import { ethers } from "ethers";
import "../style/contract.css";
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const contractAbi = HouseRentalContract.abi;

const UpdateContractForm = () => {
    const [contractId, setContractId] = useState("");
    const [agreementDetails, setAgreementDetails] = useState("");
    const [tenantAgreements, setTenantAgreements] = useState([]);
    const [landlordResponsibilities, setLandlordResponsibilities] = useState([]);
    const [agreementsBetweenLandlord, setAgreementsBetweenLandlord] = useState([]);
    const [landlordSignature, setLandlordSignature] = useState("");
    const [tenantSignature, setTenantSignature] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [rentAddress, setRentAddress] = useState("");
    const [rentLatitude, setLatitude] = useState("");
    const [rentLongitude, setLongitude] = useState("");
    const [rentPeriod, setRentPeriod] = useState(0);
    const [customRentPeriod, setCustomRentPeriod] = useState('');
    const [buildingType, setBuildingType] = useState(""); // State to store selected building type

    // Function to handle building type selection
    const handleBuildingTypeChange = (e) => {
        setBuildingType(e.target.value); // Update the building type state
    };
    const handleRentPeriodChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "other") {
            // Reset custom rent period if "Other" is selected
            setCustomRentPeriod('');
        }
        setRentPeriod(selectedValue);
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

            const tx = await contract.updateContract(
                contractId,
                agreementDetails,
                tenantAgreements,
                landlordResponsibilities,
                agreementsBetweenLandlord,
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
                        <label>Rent Address:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={rentAddress} onChange={(e) => setRentAddress(e.target.value)} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Building Type:</label>
                    </div>
                    <div className="col-75">
                        <select value={buildingType} onChange={handleBuildingTypeChange} required>
                            <option value="">Select Building Type</option>
                            <option value="Flat">Flat</option>
                            <option value="Lot House">Lot House</option>
                            <option value="Apartment">Apartment</option>
                        </select>
                    </div>
                </div>
                <div className="row">
    <div className="col-25">
        <label>Rent Period (in months):</label>
    </div>
    <div className="col-75">
        <select value={rentPeriod} onChange={(e) => handleRentPeriodChange(e)} required>
            <option value="">Select rent period</option>
            <option value="1">1 month</option>
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="other">Other</option>
        </select>
        {rentPeriod === "other" && (
            <input type="number" value={customRentPeriod} onChange={(e) => setCustomRentPeriod(parseInt(e.target.value))} placeholder="Enter custom rent period" />
        )}
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
