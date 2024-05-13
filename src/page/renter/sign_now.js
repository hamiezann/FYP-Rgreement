import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import "../../style/contract.css";
import { useGlobalContractState } from "../globally_use_variable.js/variable";

const RentContractPage = () => {
//   const history = useHistory();
  const {
    agreementDetails,
    tenantAgreement,
    landlordResponsibilities,
    agreementBetweenLandlord,
    landlordSignature,
    setLandlordSignature,
    isLoading,
    setIsLoading,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleAddTenantAgreement,
    handleRemoveTenantAgreement,
    handleTenantAgreementChange,
    handleAddLandlordResponsibility,
    handleRemoveLandlordResponsibility,
    handleLandlordResponsibilityChange,
    handleAddAgreementBetweenLandlord,
    handleRemoveAgreementBetweenLandlord,
    handleAgreementBetweenLandlordChange,
  } = useGlobalContractState();

  const generateLandlordSignature = () => {
    // Generate landlord signature logic here
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Submit contract details logic here

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
        <h2>RENT CONTRACT</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Agreement Details */}
          <div className="row">
            <div className="col-25">
              <label>Agreement Details:</label>
            </div>
            {/* <div className="col-75">
              <textarea value={agreementDetails} onChange={(e) => setAgreementDetails(e.target.value)} required />
            </div> */}
          </div>

          {/* Tenant Agreements */}
          {/* Similar to the tenant agreements section in your provided component */}

          {/* Landlord Responsibilities */}
          {/* Similar to the landlord responsibilities section in your provided component */}

          {/* Agreements Between Landlord */}
          {/* Similar to the agreements between landlord section in your provided component */}

          {/* Landlord Signature */}
          <div className="row">
            <div className="col-25">
              <label>Landlord Signature:</label>
            </div>
            <div className="col-75">
              <input type="text" value={landlordSignature} readOnly />
              <button onClick={generateLandlordSignature}>Generate Signature</button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <input type="submit" value="Sign Contract" />
          </div>

          {/* Loading, Success, and Error Messages */}
          {isLoading && <p>Loading...</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default RentContractPage;
