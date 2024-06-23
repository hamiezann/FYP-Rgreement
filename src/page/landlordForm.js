import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "../style/contract.css";
import HouseRentalContract from "../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json";
import { useGlobalContractState } from "./globally_use_variable.js/variable";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import customMarkerIcon from './marker.png'; 
import L from 'leaflet';

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

    const [amenities, setAmenities] = useState('');
    const [numBedrooms, setNumBedrooms] = useState(0);
    const [numToilets, setNumToilets] = useState(0);
    const [images, setImages] = useState([]);

const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
};

const [currency, setCurrency] = useState('MYR');
const [conversionRate, setConversionRate] = useState(1); // default to 1 for simplicity
const [ethDeposit, setEthDeposit] = useState(0);

const customIcon = L.icon({
    iconUrl: `${process.env.PUBLIC_URL}/marker.png`,
    iconSize: [38, 38], // size of the icon
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
  });
  

    const fixedPassword = "123456";
    const available = true;
    const contract_status = 'Inactive';
    const [numberOfRooms, setnumberOfRooms] = useState(''); 

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                // Example API call to fetch conversion rate
                const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency.toLowerCase()}`);
                const rate = response.data.ethereum[currency.toLowerCase()];
                setConversionRate(rate || 1);
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
                setConversionRate(1);
            }
        };

        if (currency) {
            fetchConversionRate();
        }
    }, [currency]);

    useEffect(() => {
        // Convert deposit amount to Ether using the conversion rate
        const ethValue = deposit / conversionRate;
        // setEthDeposit(ethValue);
        setEthDeposit(isNaN(ethValue) ? 0 : ethValue);
    }, [deposit, conversionRate]);

    useEffect(() => {
      // Retrieve userId from localStorage when the component mounts
      const userIdFromStorage = localStorage.getItem('userId');
      setUserId(userIdFromStorage);
      console.log(`Deposit in Ether: ${ethDeposit}`);
    }, []);
 
    // const generateAgreementDetails = () => {
    //     return `This agreement was made on ${contractCreated}, between ${landlord} (from now on referred to as 'Landlord') and ${tenantName} (from now on referred to as 'Tenant').
    //     WHEREAS the Landlord is the registered owner of the house located at ${rentAddress} (from now on referred to as the "Said House").
    //     AND WHEREAS the Landlord now agrees to lease, and the Tenant agrees to rent the Said House for ${rentDuration}, from ${effectiveStartDate} to ${effectiveEndDate}, subject to the terms and conditions contained herein.`;
    //   };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     setIsLoading(true);
    //     setSuccessMessage("");
    //     setErrorMessage("");
    //         const uni_identifier_heh = ethers.randomBytes(6);
    //         const uni_identifier = ethers.hexlify(uni_identifier_heh);

    //         const formData = new FormData();
    //         formData.append('user_id', userId);
    //         formData.append('rent_address', rentAddress);
    //         formData.append('latitude', rentLatitude);
    //         formData.append('longitude', rentLongitude);
    //         formData.append('uni_identifier', uni_identifier);
    //         formData.append('prefered_occupants', preferredOccupants);
    //         formData.append('type_of_house', buildingType);
    //         formData.append('description', description);
    //         formData.append('rent_fee', monthlyRent);
    //         formData.append('number_of_rooms', numberOfRooms);
    //         formData.append('amenities', amenities);
    //         formData.append('num_bedrooms', numBedrooms);
    //         formData.append('num_toilets', numToilets);
    //         formData.append('available', available);
    //         formData.append('contract_status', contract_status);
    
    //         for (let i = 0; i < images.length; i++) {
    //             formData.append('images[]', images[i]);
    //         }

    // const latitudeInt = Math.round(rentLatitude * 1e6); // Convert to integer with 6 decimal places
    // const longitudeInt = Math.round(rentLongitude * 1e6); // Convert to integer with 6 decimal places



    //     try {
    //         const provider = new ethers.BrowserProvider(window.ethereum);
    //         const signer = await provider.getSigner();
    //         const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    //         const depositInWei = ethers.parseUnits(ethDeposit.toString(), "ether");
    //         const houseDetails = {
    //             rent_address: rentAddress,
    //             buildingType: buildingType,
    //             rentPeriod: rentPeriod,
    //             effectiveStartDate: new Date(effectiveStartDate).getTime() / 1000,
    //             effectiveEndDate: new Date(effectiveEndDate).getTime() / 1000, 
    //             monthlyRent: monthlyRent,
    //             paymentMethod: paymentMethod,
    //             maxOverduePeriod: maxOverduePeriod,
    //             deposit: depositInWei.toString(),
    //             latitude: latitudeInt,
    //             longitude: longitudeInt
    //         };


    //         const tx = await contract.createContract(
            
    //            uni_identifier,
    //             {
    //                 name: landlord,
    //                 identificationNumber: identificationNumber,
    //                 house_address: houseAddress
    //             },
    //             {
    //                 name: tenantName,
    //                 identificationNumber: tenantIdNumber,
    //                 house_address: tenantHouseAddress
    //             },
    //             houseDetails,
    //             agreementDetails,
    //             tenantAgreement,
    //             landlordResponsibilities,
    //             agreementBetweenLandlord,
    //             landlordSignature,
    //             tenantSignature,
    //             fixedPassword
    //         );

    //         await tx.wait();
    //         setIsLoading(false);
    //         setSuccessMessage("Contract created successfully!");

    //         alert(`Contract created successfully! Contract Address: ${contractAddress}, uni_identifier: ${uni_identifier}`);
      
    //         // Get the created contract details using getContract function
    //         const createdContract = await contract.getContract(uni_identifier, fixedPassword);
               

    //     // Log the contract details to the console
    //    //console.log("Created Contract Details:", createdContract);
  
    //     const response = await fetch("http://127.0.0.1:8000/api/house-details",
    //     //  requestOptions
    //     {
    //         method: 'POST',
    //         body: formData,
    //     }
    //     );
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //   //  console.log(data); // Log the response data

    //     } catch (error) {
    //         console.error("Error creating contract:", error);
    //      //   alert('There was a problem with the fetch operation. Please try again.');
        
    //         setIsLoading(false);
    //         setErrorMessage("An error occurred while creating the contract. Please try again.");
    //     }

    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        
        const uni_identifier_heh = ethers.randomBytes(6);
        const uni_identifier = ethers.hexlify(uni_identifier_heh);
    
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('rent_address', rentAddress);
        formData.append('latitude', rentLatitude);
        formData.append('longitude', rentLongitude);
        formData.append('uni_identifier', uni_identifier);
        formData.append('prefered_occupants', preferredOccupants);
        formData.append('type_of_house', buildingType);
        formData.append('description', description);
        formData.append('rent_fee', monthlyRent);
        formData.append('number_of_rooms', numberOfRooms);
        formData.append('amenities', amenities);
        formData.append('num_bedrooms', numBedrooms);
        formData.append('num_toilets', numToilets);
        formData.append('available', available);
        formData.append('contract_status', contract_status);
    
        for (let i = 0; i < images.length; i++) {
            formData.append('images[]', images[i]);
        }
    
        const latitudeInt = Math.round(rentLatitude * 1e6); // Convert to integer with 6 decimal places
        const longitudeInt = Math.round(rentLongitude * 1e6); // Convert to integer with 6 decimal places
    
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const depositInWei = ethers.parseUnits(ethDeposit.toString(), "ether");
            const houseDetails = {
                rent_address: rentAddress,
                buildingType: buildingType,
                rentPeriod: rentPeriod,
                effectiveStartDate: new Date(effectiveStartDate).getTime() / 1000,
                effectiveEndDate: new Date(effectiveEndDate).getTime() / 1000, 
                monthlyRent: monthlyRent,
                paymentMethod: paymentMethod,
                maxOverduePeriod: maxOverduePeriod,
                deposit: depositInWei.toString(),
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
    
            const createdContract = await contract.getContract(uni_identifier, fixedPassword);
    
            const response = await fetch("http://127.0.0.1:8000/api/house-details", {
                method: 'POST',
                body: formData,
            });
    
            // Log the full response for debugging
            const responseText = await response.text();
            // console.log('Full response:', responseText);
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${responseText}`);
            }
    
            // Parse JSON only if the response is valid JSON
            const data = JSON.parse(responseText);
            // console.log(data); // Log the response data
    
        } catch (error) {
            console.error("Error creating contract:", error);
            setIsLoading(false);
            setErrorMessage("An error occurred while creating the contract. Please try again.");
        }
    };
    


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
  
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setLatitude(latitude.toFixed(6));
          setLongitude(longitude.toFixed(6));
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  
  
    return (
       
        <div className="container">
  
            <div className="title-container">
            <h2>RENTAL CONTRACT FORM</h2>
            </div>

<form onSubmit={handleSubmit} className="container mt-4">
    {/* Landlord Details */}
    <div className="form-container">
        <h2 className="mb-3">Landlord Details</h2>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Landlord Name:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control" value={landlord} onChange={(e) => setLandlord(e.target.value)} required />
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Landlord Identification Number:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} required />
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Landlord House Address:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control" value={houseAddress} onChange={(e) => setHouseAddress(e.target.value)} required />
            </div>
        </div>
    </div>

    {/* Is there a tenant */}
    <div className="form-container mt-4">
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Is there a tenant?</label>
            <div className="col-sm-9">
                <input type="checkbox" checked={hasTenant} onChange={(e) => handleCheckboxChange(e, setHasTenant, setTenantName, setTenantIdNumber, setTenantHouseAddress, setTenantSignature)} />
            </div>
        </div>
        {hasTenant && (
            <>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Tenant Name:</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Tenant Identification Number:</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" value={tenantIdNumber} onChange={(e) => setTenantIdNumber(e.target.value )} required />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Tenant House Address:</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" value={tenantHouseAddress} onChange={(e) => setTenantHouseAddress(e.target.value )} required />
                    </div>
                </div>
                {/* <div className="form-group row">
            <label className="col-sm-3 col-form-label">Effective Start Date:</label>
            <div className="col-sm-9">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveStartDate} onChange={(e) => setEffectiveStartDate(e.target.value || "")}  />
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Effective End Date:</label>
            <div className="col-sm-9">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveEndDate} onChange={(e) => setEffectiveEndDate(e.target.value || "")}  />
            </div>
        </div> */}
            </>
        )}
    </div>

    {/* Rental Details */}
    <div className="form-container mt-4">
        <h3 className="mb-3">Rental Details</h3>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Rent Address:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control" value={rentAddress} onChange={(e) => setRentAddress(e.target.value)} required />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="map-container mb-3">
                    <MapContainer
                        center={[selectedLocation.lat, selectedLocation.lng]}
                        zoom={12}
                        scrollWheelZoom={true}
                        style={{
                            border: "2px solid #6A67CE",
                            borderRadius: "10px",
                            height: "60vw",
                            width: "100%",
                            maxWidth: "700px",
                            maxHeight: "300px",
                            margin: "auto",
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
                                icon={customIcon}
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
            <div className="col-12 text-center mb-3">
                <button className="btn btn-info" onClick={handleGetCurrentLocation}>
                    Use My Current Location
                </button>
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Latitude:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control mb-2" value={rentLatitude || ""} readOnly />
                <input type="text" className="form-control" value={rentLongitude || ""} readOnly />
                <button className="btn btn-primary mt-2" type="button" onClick={handleConfirmLocation}>
                    Confirm Location
                </button>
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Building Type:</label>
            <div className="col-sm-9">
                <select className="form-control" value={buildingType} onChange={handleBuildingTypeChange} required>
                    <option value="">Select Building Type</option>
                    <option value="Flat">Flat</option>
                    <option value="Lot House">Lot House</option>
                    <option value="Apartment">Apartment</option>
                </select>
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Rent Period (in months):</label>
            <div className="col-sm-9">
                <select className="form-control" value={rentPeriod} onChange={(e) => handleRentPeriodChange(e)} required>
                    <option value="">Select rent period</option>
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="other">Other</option>
                </select>
                {rentPeriod === "other" && (
                    <input type="number" className="form-control mt-2" value={customRentPeriod} onChange={(e) => setCustomRentPeriod(parseInt(e.target.value))} placeholder="Enter custom rent period" />
                )}
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Effective Start Date:</label>
            <div className="col-sm-9">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveStartDate} onChange={(e) => setEffectiveStartDate(e.target.value)} required />
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Effective End Date:</label>
            <div className="col-sm-9">
                <input type="date" className="form-control" placeholder="DD-MM-YYYY" value={effectiveEndDate} onChange={(e) => setEffectiveEndDate(e.target.value)} required />
            </div>
        </div>
        <div className="form-group row">
            <label className="col-sm-3 col-form-label">Monthly Rent (RM):</label>
            <div className="col-sm-9">
                <input type="number" className="form-control" value={monthlyRent} onChange={(e) => setMonthlyRent(parseInt(e.target.value))} required />
            </div>
        </div>
     {/* Add Payment Method */}
   
     <div className="form-group row">
    <label className="col-sm-3 col-form-label">Payment Method:</label>
    <div className="col-sm-9">
        <select className="form-control" value={paymentMethod} onChange={handlePaymentMethodChange} required>
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            {/* Add more payment methods as needed */}
        </select>
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Max Overdue Period (in days):</label>
    <div className="col-sm-9">
        <select className="form-control" value={maxOverduePeriod} onChange={(e) => handleMaxOverduePeriodChange(e)} required>
            <option value="">Select max overdue period</option>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="other">Other</option>
        </select>
        {maxOverduePeriod === "other" && (
            <input type="number" className="form-control mt-2" value={customMaxOverduePeriod} onChange={(e) => setCustomMaxOverduePeriod(parseInt(e.target.value))} placeholder="Enter custom max overdue period" />
        )}
    </div>
</div>


{/* <div className="form-group row">
    <label className="col-sm-3 col-form-label">Deposit:</label>
    <div className="col-sm-9">
        <input type="number" className="form-control" value={deposit} onChange={(e) => setDeposit(parseInt(e.target.value))} required />
    </div>
</div> */}

{/* <div className="form-group row">
    <label className="col-sm-3 col-form-label">Utility Deposit:</label>
    <div className="col-sm-9">
        <input type="number" className="form-control" value={utilityDeposit} onChange={(e) => setUtilityDeposit(parseInt(e.target.value))} required />
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Advance Rental:</label>
    <div className="col-sm-9">
        <input type="number" className="form-control" value={advanceRental} onChange={(e) => setAdvanceRental(parseInt(e.target.value))} required />
    </div>
</div> */}
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Deposit:</label>
                <div className="col-sm-6">
                    <input
                        type="number"
                        className="form-control"
                        value={deposit}
                        onChange={(e) => setDeposit(parseInt(e.target.value) || 0)}
                        // onChange={(e) => setDeposit(parseInt(e.target.value) )}
                        required
                    />
                </div>
                <div className="col-sm-3">
                <p>Selected Currency: {currency}</p>
                    <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="RM">MYR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        {/* Add other currencies as needed */}
                    </select>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Equivalent Deposit in Ether:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        className="form-control"
                        value={ethDeposit.toString()}
                        readOnly
                    />
                </div>
            </div>



<div className="form-group">
    <h3>Contract Terms</h3>
    <div className="form-row">
                    <div className="form-group col-12">
                        <label htmlFor="agreementDetails">Agreement Details:</label>
                        <textarea
                            id="agreementDetails"
                            className="form-control"
                            value={agreementDetails}
                            onChange={(e) => setAgreementDetails(e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div>


    <div className="form-row">
        <div className="form-group col-12">
            <label>Tenant Agreements:</label>
            {tenantAgreement.map((agreement, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                    <textarea className="form-control" value={agreement} readOnly />
                    <button type="button" className="btn btn-danger ml-2" onClick={() => handleRemoveTenantAgreement(index)}>Remove</button>
                </div>
            ))}
            <select className="form-control mt-2" value={newTenantAgreement} onChange={(e) => setNewTenantAgreement(e.target.value)}>
                <option value="">Select an option...</option>
                {tenantAgreementOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <button type="button" className="btn btn-primary mt-2" onClick={handleAddTenantAgreement}>Add Tenant Agreement</button>
        </div>
    </div>


    <div className="form-row">
        <div className="form-group col-12">
            <label>Landlord Responsibilities:</label>
            {landlordResponsibilities.map((responsibility, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                    <textarea className="form-control" value={responsibility} readOnly />
                    <button type="button" className="btn btn-danger ml-2" onClick={() => handleRemoveLandlordResponsibility(index)}>Remove</button>
                </div>
            ))}
            <select className="form-control mt-2" value={newLandlordResponsibilites} onChange={(e) => setNewLandlordResponsibilities(e.target.value)}>
                <option value="">Select an option...</option>
                {landlordAgreementOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <button type="button" className="btn btn-primary mt-2" onClick={handleAddLandlordResponsibility}>Add Landlord Responsibility</button>
        </div>
    </div>

  
    <div className="form-row">
        <div className="form-group col-12">
            <label>Agreements Between Landlord:</label>
            {agreementBetweenLandlord.map((agreement, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                    <textarea className="form-control" value={agreement} readOnly />
                    <button type="button" className="btn btn-danger ml-2" onClick={() => handleRemoveAgreementBetweenLandlord(index)}>Remove</button>
                </div>
            ))}
            <select className="form-control mt-2" value={newAgreementBetweenLandlord} onChange={(e) => setNewAgreementBetweenLandlord(e.target.value)}>
                <option value="">Select an option...</option>
                {agreementBetweenLandlordOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <button type="button" className="btn btn-primary mt-2" onClick={handleAddAgreementBetweenLandlord}>Add Agreement Between Landlord</button>
        </div>
    </div>
</div>


<div className="form-group row">
    <label className="col-sm-3 col-form-label">Preferred Occupants:</label>
    <div className="col-sm-9">
        <select className="form-control" value={preferredOccupants} onChange={(e) => setPreferredOccupants(e.target.value)}>
            <option value="">Select Preferred Occupants</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Number of Rooms:</label>
    <div className="col-sm-9">
        <select className="form-control" value={numberOfRooms} onChange={(e) => setnumberOfRooms(e.target.value)}>
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
<div className="form-group row">
    <label className="col-sm-3 col-form-label">House Description:</label>
    <div className="col-sm-9">
        <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Amenities Offered by Landlord:</label>
    <div className="col-sm-9">
        <input type="text" className="form-control" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Number of Bedrooms:</label>
    <div className="col-sm-9">
        <input type="number" className="form-control" value={numBedrooms} onChange={(e) => setNumBedrooms(e.target.value)} />
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Number of Toilets:</label>
    <div className="col-sm-9">
        <input type="number" className="form-control" value={numToilets} onChange={(e) => setNumToilets(e.target.value)} />
    </div>
</div>
<div className="form-group row">
    <label className="col-sm-3 col-form-label">Upload Pictures:</label>
    <div className="col-sm-9">
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
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
                        <button className="btn btn-primary" onClick={handleSubmit}>Create Contract</button>
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
