import React, { useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../../style/contract.css"
import HouseRentalContract from "../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useGlobalContractState } from "../globally_use_variable.js/variable";
import { computeAddress } from 'ethers';

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
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

    // const tenantAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
    // const landlordAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
    // const agreementBetweenLandlordOptions = ['Option 1', 'Option 2', 'Option 3'];

    const tenantAgreementOptions = [
        'Agree to pay the rent amount as specified in the rental agreement document.',
        'Do not engage in illegal, unlawful, or immoral activities on the premises.',
        'Do not sublet any part of the house without written consent from the landlord.',
        'Obtain written consent before making any changes to the house.',
        'Do not keep pets on the premises.',
        'Do not store hazardous materials without proper authorization.',
        'Keep the house clean inside and out.',
        'Maintain the house in good condition.',
        'Get permission before hanging anything on the walls and restore them before leaving.',
        'Install additional locks only with written consent and provide duplicates to the landlord.',
        'Comply with all laws, regulations, and insurance requirements.',
        'Respect the peace and comfort of neighbors.',
        'Resolve disputes with neighbors peacefully.',
        'Allow landlord entry for inspections or repairs with 48 hours notice.',
        'Take responsibility for any damages caused during the tenancy.',
        'Pay utility bills on time.',
        'Return the house in the same condition it was rented, covering cleaning and repairs if needed.'
      ];
      
      const landlordAgreementOptions = [
        'Repair any significant damage to the house caused by factors beyond the tenant\'s control.',
        'Return the deposit within 21 days after the tenancy ends, deducting any outstanding rent or utility bills, repair costs for damage caused by the tenant, charges according to the agreement terms, and restoration expenses.',
        'Ensure safety measures are in place before the tenant moves in, such as functional door knobs, window locks, and safe wiring and water supply.'
      ];
      
      const agreementBetweenLandlordOptions = [
        'The landlord will hand over the house keys to the tenant upon receiving the deposit, unless otherwise agreed.',
        'If the agreement ends, the tenant must promptly return the house keys and access card to the landlord.',
        'In case of non-payment of rent, the landlord may use the deposit to cover arrears and terminate the agreement, with the option to grant additional time for payment.',
        'To renew the rental period, the tenant must notify the landlord in writing at least two months before the end of the current period.',
        'The landlord reserves the right not to renew the rental period.',
        'The landlord can terminate the agreement immediately for violations or when reclaiming the house for any purpose, with a written notice of at least two months in advance.',
        'The tenant can terminate the rental by giving a written notice of at least two months; otherwise, the deposit will not be refunded.',
        'During the notice period, the tenant must continue paying rent as usual without using the deposit.',
        'Termination by the tenant does not exempt them from paying outstanding amounts owed to the landlord.',
        'Any disputes between the landlord and tenant shall be resolved through peaceful arbitration if an amicable resolution cannot be reached.'
      ];
    const [checktenantAddress, setTenantAddress] = useState("");
 

    const [effectiveStartDate, setEffectiveStartDate] = useState('');
    const [effectiveEndDate, setEffectiveEndDate] = useState('');
    const startDateTimestamp = Math.floor(new Date(effectiveStartDate).getTime() / 1000);
    const endDateTimestamp = Math.floor(new Date(effectiveEndDate).getTime() / 1000);

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
    //  const getChecksummedAddress = (address) => {
    //     if (!address) {
    //         throw new Error("Ethereum address cannot be empty");
    //     }
    //     try {
    //         // return ethers.getAddress(address);
    //         return ethers.computeAddress(address);
    //     } catch (e) {
    //         throw new Error("Invalid Ethereum address");
    //     }
    // };
  

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
           // const tenantAddress = getChecksummedAddress(checktenantAddress);
            const tenantAddress = checktenantAddress;
            
            const tx = await contract.updateContract(
                contractId,
                fixedPassword,
                agreementDetails,
                tenantAgreement,
                landlordResponsibilities,
                agreementBetweenLandlord,
                landlordSignature,
                tenantSignature,
                tenantAddress,
                // effectiveStartDate,
                // effectiveEndDate
                startDateTimestamp,
                endDateTimestamp
               
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
                            <label>Tenant Crypto Address:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={checktenantAddress} onChange={(e) => setTenantAddress(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row">
            <label className="col-25">Effective Start Date:</label>
            <div className="col-75">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveStartDate} onChange={(e) => setEffectiveStartDate(e.target.value)} required />
            </div>
        </div>
        <div className=" row">
            <label className="col-25">Effective End Date:</label>
            <div className="col-75">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveEndDate} onChange={(e) => setEffectiveEndDate(e.target.value)} required />
            </div>
        </div>
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
