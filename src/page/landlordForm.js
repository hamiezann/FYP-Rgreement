import React, { useState } from "react";
import { ethers } from "ethers";
import "../style/contract.css";
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const contractAbi = HouseRentalContract.abi;
// const { contractAddress } = require('../../scripts/deploy2.js');

const HouseRentalForm = () => {
    const [landlord, setLandlord] = useState("");
    const [identificationNumber, setIdentificationNumber] = useState("");
    const [houseAddress, setHouseAddress] = useState("");
    const [hasTenant, setHasTenant] = useState(false); // State to track whether there is a tenant
    const [tenantName, setTenantName] = useState(""); // State to store tenant name
    const [tenantIdNumber, setTenantIdNumber] = useState(""); // State to store tenant identification number
    const [tenantHouseAddress, setTenantHouseAddress] = useState(""); // State to store tenant house address
    //const [tenantSignature, setTenantSignature] = useState(""); // State to store tenant house address
   // const [password, setPassword] = useState("123"); // Set password to "123"
    const [rentAddress, setRentAddress] = useState("");
    const [rentLatitude, setLatitude] = useState("");
    const [rentLongitude, setLongitude] = useState("");
    const [rentPeriod, setRentPeriod] = useState(0);
    const [customRentPeriod, setCustomRentPeriod] = useState('');
    const [effectiveDate, setEffectiveDate] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [maxOverduePeriod, setMaxOverduePeriod] = useState(0);
    const [customMaxOverduePeriod, setCustomMaxOverduePeriod] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [utilityDeposit, setUtilityDeposit] = useState(0);
    const [advanceRental, setAdvanceRental] = useState(0);
    const [agreementDetails, setAgreementDetails] = useState("");
    const [tenantAgreement, setTenantAgreement] = useState([""]);
    const [landlordResponsibilities, setLandlordResponsibilities] = useState([""]);
    const [agreementBetweenLandlord, setAgreementBetweenLandlord] = useState([""]);
    const [landlordSignature, setLandlordSignature] = useState("");
    const [tenantSignature, setTenantSignature] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Function to handle payment method selection
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value); // Update the payment method state
    };
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

    const handleMaxOverduePeriodChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "other") {
            // Reset custom max overdue period if "Other" is selected
            setCustomMaxOverduePeriod('');
        }
        setMaxOverduePeriod(selectedValue);
    };


        // Function to handle checkbox change
        const handleCheckboxChange = (e) => {
            setHasTenant(e.target.checked); // Update the hasTenant state based on checkbox status
            // If the checkbox is unchecked, reset tenant details
            if (!e.target.checked) {
                setTenantName("");
                setTenantIdNumber("");
                setTenantHouseAddress("");
                setTenantSignature("");
            }
        };
    
    const handleAddTenantAgreement = () => {
        setTenantAgreement(prevAgreement => [...prevAgreement, ""]);
    };

    const handleRemoveTenantAgreement = index => {
        const updatedAgreements = [...tenantAgreement];
        updatedAgreements.splice(index, 1);
        setTenantAgreement(updatedAgreements);
    };

    const handleTenantAgreementChange = (index, value) => {
        const updatedAgreements = [...tenantAgreement];
        updatedAgreements[index] = value;
        setTenantAgreement(updatedAgreements);
    };

    const handleAddLandlordResponsibility = () => {
        setLandlordResponsibilities(prevResponsibilities => [...prevResponsibilities, ""]);
    };

    const handleRemoveLandlordResponsibility = index => {
        const updatedResponsibilities = [...landlordResponsibilities];
        updatedResponsibilities.splice(index, 1);
        setLandlordResponsibilities(updatedResponsibilities);
    };

    const handleLandlordResponsibilityChange = (index, value) => {
        const updatedResponsibilities = [...landlordResponsibilities];
        updatedResponsibilities[index] = value;
        setLandlordResponsibilities(updatedResponsibilities);
    };

    const handleAddAgreementBetweenLandlord = () => {
        setAgreementBetweenLandlord(prevAgreements => [...prevAgreements, ""]);
    };

    const handleRemoveAgreementBetweenLandlord = index => {
        const updatedAgreements = [...agreementBetweenLandlord];
        updatedAgreements.splice(index, 1);
        setAgreementBetweenLandlord(updatedAgreements);
    };

    const handleAgreementBetweenLandlordChange = (index, value) => {
        const updatedAgreements = [...agreementBetweenLandlord];
        updatedAgreements[index] = value;
        setAgreementBetweenLandlord(updatedAgreements);
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

            const houseDetails = {
                rent_address: rentAddress,
                buildingType: buildingType,
                rentPeriod: rentPeriod,
                effectiveDate: new Date(effectiveDate).getTime() / 1000, // Convert date to Unix timestamp
                monthlyRent: monthlyRent,
                paymentMethod: paymentMethod,
                maxOverduePeriod: maxOverduePeriod,
                deposit: deposit,
                utilityDeposit: utilityDeposit,
                advanceRental: advanceRental,
                latitude: rentLatitude,
                longitude: rentLongitude
            };
            // Extract or truncate to the first 6 bytes
            const uni_identifier_heh = ethers.randomBytes(6);

// Optional: Convert byte array to hex string for display
const uni_identifier = ethers.hexlify(uni_identifier_heh);
console.log("Uni Identifier (byte array):", uni_identifier_heh);
console.log("Uni Identifier (hex string):", uni_identifier);

            const tx = await contract.createContract(
              //  ethers.utils.id(landlord), // Convert landlord to bytes32
               uni_identifier,

                {
                    name: landlord,
                    identificationNumber: identificationNumber,
                    house_address: houseAddress
                },
                {
                    name: tenantName,
                    identificationNumber: tenantIdNumber,
                    house_address: tenantHouseAddress
                },
                houseDetails,
                agreementDetails,
                tenantAgreement,
                landlordResponsibilities,
                agreementBetweenLandlord,
                landlordSignature,
                tenantSignature,
              //  password
            );

            await tx.wait();
            setIsLoading(false);
            setSuccessMessage("Contract created successfully!");

            alert(`Contract created successfully! Contract Address: ${contractAddress}, uni_identifier: ${uni_identifier}`);

            
        // Get the created contract details using getContract function
       // const createdContract = await contract.getContract(uni_identifier, password);
        const createdContract = await contract.getContract(uni_identifier);

        // Log the contract details to the console
        console.log("Created Contract Details:", createdContract);
        } catch (error) {
            console.error("Error creating contract:", error);
            setIsLoading(false);
            setErrorMessage("An error occurred while creating the contract. Please try again.");
        }
    };

    return (
       
        <div className="container">
  
            <div className="title-container">
            <h2>RENTAL CONTRACT FORM</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
            <div className="form-container">
            <h2>Landlord Details</h2>
                <div className="row">
                    <div className="col-25">
                        <label>Landlord Name:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={landlord} onChange={(e) => setLandlord(e.target.value)} required />
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <label>Landlord Identification Number:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} required />
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <label>Landlord House Address:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={houseAddress} onChange={(e) => setHouseAddress(e.target.value)} required />
                    </div>
                </div>
                
                {/* Add Landlord Signature */}
                <div className="row">
                    <div className="col-25">
                        <label>Landlord Signature:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={landlordSignature} onChange={(e) => setLandlordSignature(e.target.value)} required />
                    </div>
                </div>
                </div>
                <div className="form-container">
                                   {/* Add checkbox for tenant */}
                <div className="row">
                    <div className="col-25">
                        <label>Is there a tenant?</label>
                    </div>
                    <div className="col-75">
                        <input type="checkbox" checked={hasTenant} onChange={handleCheckboxChange} />
                    </div>
                </div>

                {/* Tenant details (conditionally rendered based on checkbox status) */}
                {hasTenant && (
                    <>
                        <div className="row">
                            <div className="col-25">
                                <label>Tenant Name:</label>
                            </div>
                            <div className="col-75">
                                <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-25">
                                <label>Tenant Identification Number:</label>
                            </div>
                            <div className="col-75">
                                <input type="text" value={tenantIdNumber} onChange={(e) => setTenantIdNumber(e.target.value)} required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-25">
                                <label>Tenant House Address:</label>
                            </div>
                            <div className="col-75">
                                <input type="text" value={tenantHouseAddress} onChange={(e) => setTenantHouseAddress(e.target.value)} required />
                            </div>
                        </div>

                                        {/* Add Tenant Signature */}
                {/* <div className="row">
                    <div className="col-25">
                        <label>Tenant Signature:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={tenantSignature} onChange={(e) => setTenantSignature(e.target.value)} required />
                    </div>
                </div> */}
                    </>
                )}
                </div>
                <div className="form-container">
                    <h3>Rental Details</h3>
                                   {/* Add Rent Address */}
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
                        <label>Latitude & Longitude:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={rentLatitude} onChange={(e) => setLatitude(e.target.value)} required />
                        <input type="text" value={rentLongitude} onChange={(e) => setLongitude(e.target.value)} required />
                    </div>
                </div>

                {/* Add Building Type */}
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

                {/* Add Rent Period */}
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


                {/* Add Effective Date */}
                <div className="row">
                    <div className="col-25">
                        <label>Effective Date:</label>
                    </div>
                    <div className="col-75">
                        <input placeholder="DD-MM-YYYY" type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required />
                    </div>
                </div>

                {/* Add Monthly Rent */}
                <div className="row">
                    <div className="col-25">
                        <label>Monthly Rent (RM):</label>
                    </div>
                    <div className="col-75">
                        <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(parseInt(e.target.value))} required />
                    </div>
                </div>

                {/* Add Payment Method */}
                <div className="row">
                    <div className="col-25">
                        <label>Payment Method:</label>
                    </div>
                    <div className="col-75">
                        <select value={paymentMethod} onChange={handlePaymentMethodChange} required>
                            <option value="">Select Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Credit Card">Credit Card</option>
                            {/* Add more payment methods as needed */}
                        </select>
                    </div>
                </div>

                {/* Add Max Overdue Period */}
                <div className="row">
                <div className="col-25">
                    <label>Max Overdue Period (in days):</label>
                </div>
                <div className="col-75">
                    <select value={maxOverduePeriod} onChange={(e) => handleMaxOverduePeriodChange(e)} required>
                        <option value="">Select max overdue period</option>
                        <option value="1">1 day</option>
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="other">Other</option>
                    </select>
                    {maxOverduePeriod === "other" && (
                        <input 
                            type="number" 
                            value={customMaxOverduePeriod} 
                            onChange={(e) => setCustomMaxOverduePeriod(parseInt(e.target.value))} 
                            placeholder="Enter custom max overdue period" 
                        />
                    )}
                </div>
            </div>

                {/* Add Deposit */}
                <div className="row">
                    <div className="col-25">
                        <label>Deposit:</label>
                    </div>
                    <div className="col-75">
                        <input type="number" value={deposit} onChange={(e) => setDeposit(parseInt(e.target.value))} required />
                    </div>
                </div>

                {/* Add Utility Deposit */}
                <div className="row">
                    <div className="col-25">
                        <label>Utility Deposit:</label>
                    </div>
                    <div className="col-75">
                        <input type="number" value={utilityDeposit} onChange={(e) => setUtilityDeposit(parseInt(e.target.value))} required />
                    </div>
                </div>

                {/* Add Advance Rental */}
                <div className="row">
                    <div className="col-25">
                        <label>Advance Rental:</label>
                    </div>
                    <div className="col-75">
                        <input type="number" value={advanceRental} onChange={(e) => setAdvanceRental(parseInt(e.target.value))} required />
                    </div>
                </div>
                </div>

                <div className="form-container">
                    <h3>Contract Terms</h3>
                    
                {/* Add Agreement Details */}
                <div className="row">
                    <div className="col-25">
                        <label>Agreement Details:</label>
                    </div>
                    <div className="col-75">
                        <textarea value={agreementDetails} onChange={(e) => setAgreementDetails(e.target.value)} required />
                    </div>
                </div>

                {/* Add Tenant Agreements */}
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

                {/* Add Landlord Responsibilities */}
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

                {/* Add Agreements Between Landlord */}
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
                </div>
               



                {/* Add Loading and Success/Error Messages */}
                {isLoading ? (
                    <div className="row">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="button-container">
                        <input type="submit" value="Create Contract" />
                    </div>
                )}

                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {/* </div> */}
            </form>

        </div>


   
    );
    
};

export default HouseRentalForm;
