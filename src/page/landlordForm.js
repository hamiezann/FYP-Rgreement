import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../style/contract.css";
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useGlobalContractState } from "./globally_use_variable.js/variable";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = HouseRentalContract.abi;

const HouseRentalForm = () => {

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
    effectiveStartDate,
    setEffectiveStartDate,
    effectiveEndDate,
    setEffectiveEndDate,
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

    const fixedPassword = "123456";
    const [numberOfRooms, setnumberOfRooms] = useState(''); 
    // const [numberOfRooms, setnumberOfRooms] = useState(0); 

    useEffect(() => {
      // Retrieve userId from localStorage when the component mounts
      const userIdFromStorage = localStorage.getItem('userId');
      setUserId(userIdFromStorage);
    }, []);
 
    // const generateAgreementDetails = () => {
    //     return `This agreement was made on ${contractCreated}, between ${landlord} (from now on referred to as 'Landlord') and ${tenantName} (from now on referred to as 'Tenant').
    //     WHEREAS the Landlord is the registered owner of the house located at ${rentAddress} (from now on referred to as the "Said House").
    //     AND WHEREAS the Landlord now agrees to lease, and the Tenant agrees to rent the Said House for ${rentDuration}, from ${effectiveStartDate} to ${effectiveEndDate}, subject to the terms and conditions contained herein.`;
    //   };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
            // Extract or truncate to the first 6 bytes
            const uni_identifier_heh = ethers.randomBytes(6);

            // Optional: Convert byte array to hex string for display
            const uni_identifier = ethers.hexlify(uni_identifier_heh);
            console.log("Uni Identifier (byte array):", uni_identifier_heh);
            console.log("Uni Identifier (hex string):", uni_identifier);


    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId, // Replace with actual user ID
            latitude: rentLatitude,
            longitude: rentLongitude,
            uni_identifier: uni_identifier,
            prefered_occupants: preferredOccupants,
            type_of_house: buildingType,
            description: description, // Assuming this is the description from the form
            rent_fee: monthlyRent,
            number_of_rooms: numberOfRooms // Assuming this is the number of rooms from the form
            // Add other form fields as needed
        })
    };
    const latitudeInt = Math.round(rentLatitude * 1e6); // Convert to integer with 6 decimal places
    const longitudeInt = Math.round(rentLongitude * 1e6); // Convert to integer with 6 decimal places



        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const houseDetails = {
                rent_address: rentAddress,
                buildingType: buildingType,
                rentPeriod: rentPeriod,
                effectiveStartDate: new Date(effectiveStartDate).getTime() / 1000, // Convert date to Unix timestamp
                effectiveEndDate: new Date(effectiveEndDate).getTime() / 1000, // Convert date to Unix timestamp
                monthlyRent: monthlyRent,
                paymentMethod: paymentMethod,
                maxOverduePeriod: maxOverduePeriod,
                deposit: deposit,
                utilityDeposit: utilityDeposit,
                advanceRental: advanceRental,
                // latitude: rentLatitude,
                // longitude: rentLongitude
                latitude: latitudeInt,
                longitude: longitudeInt
            };


            const tx = await contract.createContract(
            
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
                fixedPassword
            );

            await tx.wait();
            setIsLoading(false);
            setSuccessMessage("Contract created successfully!");

            alert(`Contract created successfully! Contract Address: ${contractAddress}, uni_identifier: ${uni_identifier}`);
      
            // Get the created contract details using getContract function
            //const createdContract = await contract.getContract(uni_identifier);
            const createdContract = await contract.getContract(uni_identifier, fixedPassword);
               

        // Log the contract details to the console
        console.log("Created Contract Details:", createdContract);
        const response = await fetch("http://127.0.0.1:8000/api/house-details", requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Log the response data

        } catch (error) {
            console.error("Error creating contract:", error);
         //   alert('There was a problem with the fetch operation. Please try again.');
        
            setIsLoading(false);
            setErrorMessage("An error occurred while creating the contract. Please try again.");
        }

    };

  const tenantAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
  const landlordAgreementOptions = ['Option 1', 'Option 2', 'Option 3']; 
  const agreementBetweenLandlordOptions = ['Option 1', 'Option 2', 'Option 3']; 

//   const [selectedLocation, setSelectedLocation] = useState('');
//   const handleClick = (event) => {
//     const {lat, lng} = event.latlng;
//     setSelectedLocation({lat,lng});
//     setLatitude(lat);
//     setLongitude(lng);
//   }
// const [selectedLocation, setSelectedLocation] = useState("");

const [selectedLocation, setSelectedLocation] = useState({lat: 4.2105, lng: 101.9758 });


const handleClick = (event) => {
    setSelectedLocation(event.latlng);
  };
  
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setLatitude(parseFloat(selectedLocation.lat.toFixed(6)));
      setLongitude(parseFloat(selectedLocation.lng.toFixed(6)));
    }
  };
  

  
  
    return (
       
        <div className="container">
  
            <div className="title-container">
            <h2>RENTAL CONTRACT FORM</h2>
            </div>

            
            <form onSubmit={handleSubmit}>
            {/* Landlord Details */}
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
                {/* <div className="row">
                    <div className="col-25">
                        <label>Landlord Signature:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={landlordSignature} onChange={(e) => setLandlordSignature(e.target.value)} required />
                    </div>
                </div> */}

                </div>
            {/* Is there a tenant */}
                <div className="form-container">
                                   {/* Add checkbox for tenant */}
                <div className="row">
                    <div className="col-25">
                        <label>Is there a tenant?</label>
                    </div>
                    <div className="col-75">
                        {/* <input type="checkbox" checked={hasTenant} onChange={handleCheckboxChange} /> */}
                        <input type="checkbox" checked={hasTenant} onChange={(e) => handleCheckboxChange(e, setHasTenant, setTenantName, setTenantIdNumber, setTenantHouseAddress, setTenantSignature)} />

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
            {/* Rental Details */}
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

                {/* <div className="row">
                    <div className="col-25">
                        <label>Latitude & Longitude:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={rentLatitude} onChange={(e) => setLatitude(e.target.value)} required />
                        <input type="text" value={rentLongitude} onChange={(e) => setLongitude(e.target.value)} required />
                    </div>
                </div> */}
<div className="row">
  <div className="col-75">
    <div className="map-container">
      <MapContainer
        center={[4.2105, 101.9758]}
        zoom={12}
        scrollWheelZoom={true}
        style={{
          border: "2px solid #6A67CE",
          borderRadius: "10px",
          height: "60vw",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "400px",
          margin: "10px 10.5%",
        }}
        onClick={handleClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const lat = e.target.getLatLng().lat.toFixed(6);
                    const lng = e.target.getLatLng().lng.toFixed(6);
                    setSelectedLocation(e.target.getLatLng());
                    setLatitude(lat);
                    setLongitude(lng);
                  }
            }}
          >
            <Popup>
              You clicked here:<br />
              Latitude: {selectedLocation.lat.toFixed(4)}<br />
              Longitude: {selectedLocation.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  </div>

</div>
<div className="row">
<div className="col-75">
    <label>Latitude:</label>
    <input type="text" value={rentLatitude || ""} readOnly />
    <input type="text" value={rentLongitude || ""} readOnly />

    <button type="button" onClick={handleConfirmLocation}>
      Confirm Location
    </button>
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


                {/* Add Effective Start Date */}
                <div className="row">
                    <div className="col-25">
                        <label>Effective Start Date:</label>
                    </div>
                    <div className="col-75">
                        <input placeholder="DD-MM-YYYY" type="date" value={effectiveStartDate} onChange={(e) => setEffectiveStartDate(e.target.value)} required />
                    </div>
                </div>
                {/* Add Effective End Date */}
                <div className="row">
                    <div className="col-25">
                        <label>Effective End Date:</label>
                    </div>
                    <div className="col-75">
                        <input placeholder="DD-MM-YYYY" type="date" value={effectiveEndDate} onChange={(e) => setEffectiveEndDate(e.target.value)} required />
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
            {/* Contract Terms */}
                <div className="form-container">
                    <h3>Contract Terms</h3>
                    
                {/* Add Agreement Details */}
                <div className="row">
                    <div className="col-25"> 
                        <label>Agreement Details:</label>
                    </div>
                    <div className="col-75">
                        <textarea value={agreementDetails} onChange={(e) => setAgreementDetails(e.target.value)} required />
                        {/* <textarea value={generateAgreementDetails()} readOnly /> */}
                    </div>
                </div>

                {/* Add Tenant Agreements */}
                {/* <div className="row">
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
                </div> */}
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

                </div>
            {/* database data*/}
                <div className="form-container">
                <div className="row">
        <div className="col-25">
            <label>Preferred Occupants:</label>
        </div>
        <div className="col-75">
            <select value={preferredOccupants} onChange={(e) => setPreferredOccupants(e.target.value)}>
                <option value="">Select Preferred Occupants</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
                </div>
                {/* number of rooms */}
                <div className="row">
                    <div className="col-25">
                        <label>Number of Rooms</label>
                    </div>
                    <div className="col-75">
                        <select value={numberOfRooms} onChange={(e) => setnumberOfRooms(e.target.value)}>
                        <option value="">Select Number of Rooms</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                </div>
                {/* house descriiption */}
                <div className="row">
                    <div className="col-25">
                        <label>House Description</label>
                    </div>
                    <div className="col-75">
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                        {/* <input type="submit" value="Create Contract" /> */}
                        <button onClick={handleSubmit}>Create Contract</button>
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
