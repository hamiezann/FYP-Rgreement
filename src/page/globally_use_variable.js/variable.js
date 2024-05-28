import { useState } from 'react';

export const useGlobalContractState = () => {
    const [landlord, setLandlord] = useState("");
    const [identificationNumber, setIdentificationNumber] = useState("");
    const [houseAddress, setHouseAddress] = useState("");
    const [hasTenant, setHasTenant] = useState(false); // State to track whether there is a tenant
    const [tenantName, setTenantName] = useState(""); // State to store tenant name
    const [tenantIdNumber, setTenantIdNumber] = useState(""); // State to store tenant identification number
    const [tenantHouseAddress, setTenantHouseAddress] = useState(""); 

    const [rentAddress, setRentAddress] = useState('');
    const [rentLatitude, setLatitude] = useState(null);
    const [rentLongitude, setLongitude] = useState(null);
    
    const [rentPeriod, setRentPeriod] = useState(0);
    const [customRentPeriod, setCustomRentPeriod] = useState('');
    const [effectiveStartDate, setEffectiveStartDate] = useState("");
    const [effectiveEndDate, setEffectiveEndDate] = useState("");
    const [monthlyRent, setMonthlyRent] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [maxOverduePeriod, setMaxOverduePeriod] = useState(0);
    const [customMaxOverduePeriod, setCustomMaxOverduePeriod] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [utilityDeposit, setUtilityDeposit] = useState(0);
    const [advanceRental, setAdvanceRental] = useState(0);
    const [agreementDetails, setAgreementDetails] = useState('');
    const [tenantAgreement, setTenantAgreement] = useState(['']);
    const [newTenantAgreement, setNewTenantAgreement] = useState('');
    const [landlordResponsibilities, setLandlordResponsibilities] = useState(['']);
    const [newLandlordResponsibilites, setNewLandlordResponsibilities] = useState('');
    const [agreementBetweenLandlord, setAgreementBetweenLandlord] = useState(['']);
    const [newAgreementBetweenLandlord, setNewAgreementBetweenLandlord] = useState('');
    const [landlordSignature, setLandlordSignature] = useState('');
    const [tenantSignature, setTenantSignature] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [preferredOccupants, setPreferredOccupants] = useState(''); 
    //const [numberOfRooms, setNumberOfRooms] = useState(''); 
    const [description, setDescription] = useState(''); 
    


    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value); // Update the payment method state
    };

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

        // Function to handle checkbox change for tenant
    const handleCheckboxChange = (e) => {
            setHasTenant(e.target.checked); // Update the hasTenant state based on checkbox status
            // If the checkbox is unchecked, reset tenant details
            if (!e.target.checked) {
                setTenantName("");
                setTenantIdNumber("");
                setTenantHouseAddress("");
                setTenantSignature("");
                // setEffectiveStartDate("");
                // setEffectiveEndDate("");
            }
        };
    
    // const handleAddTenantAgreement = () => {
    //     setTenantAgreement(prevAgreement => [...prevAgreement, ""]);
    // };

    const handleAddTenantAgreement = () => {
        setTenantAgreement([...tenantAgreement, newTenantAgreement]);
        setNewTenantAgreement('');
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

    // Landlord Logic
    // const handleAddLandlordResponsibility = () => {
    //     setLandlordResponsibilities(prevResponsibilities => [...prevResponsibilities, ""]);
    // };
    const handleAddLandlordResponsibility = () => {
        setLandlordResponsibilities([...landlordResponsibilities, newLandlordResponsibilites ]);
        setNewLandlordResponsibilities('');
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

    // Agreement Between Landlord Logic
    // const handleAddAgreementBetweenLandlord = () => {
    //     setAgreementBetweenLandlord(prevAgreements => [...prevAgreements, ""]);
    // };
    const handleAddAgreementBetweenLandlord = () => {
        setAgreementBetweenLandlord([...agreementBetweenLandlord, newAgreementBetweenLandlord]);
        setNewAgreementBetweenLandlord('');
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

    const [userId, setUserId] = useState('');

    return {
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
      //  numberOfRooms,
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
    };
};
