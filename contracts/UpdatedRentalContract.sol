// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HouseRentalContract {
    struct PersonalInfo {
        string name;
        string identificationNumber;
        string house_address;
    }

    struct HouseDetails {
        string rent_address;
        string buildingType;
        uint rentPeriod;
        uint effectiveDate;
        uint monthlyRent;
        string paymentMethod;
        uint maxOverduePeriod;
        uint deposit;
        uint utilityDeposit;
        uint advanceRental;
        int256 latitude;
        int256 longitude;

    }

    struct ContractTerms {
        uint creationDate;
        PersonalInfo landlord;
        PersonalInfo tenant;
        HouseDetails houseDetails;
        string agreementDetails;
        string[] tenantAgreements;
        string[] landlordResponsibilities;
        string[] agreementsBetweenLandlord;
        string landlordSignature;
        string tenantSignature;
        // string password;
    }

    struct AuditTrail {
        uint timestamp;
        string action;
        address actor;

    }

    mapping(bytes6 => ContractTerms) public contracts;
    mapping(bytes6 => address) public contractOwners;
    mapping(bytes6 => AuditTrail[]) public contractAuditTrails;

    modifier onlyLandlord(bytes6 contractId) {
        require(contractOwners[contractId] == msg.sender, "Only landlord can perform this action");
        _;
    }

modifier onlyTenant(bytes6 contractId) {
    require(msg.sender == address(bytes20(bytes(contracts[contractId].tenant.house_address))), "Only the tenant can perform this action");
    _;
}

    // Event to emit when a contract is updated
    event ContractUpdated(bytes6 indexed contractId, string action);

        // Modifier to record actions in the audit trail
    modifier recordAuditTrail(bytes6 contractId, string memory action) {
        _;
        contractAuditTrails[contractId].push(AuditTrail(block.timestamp, action, msg.sender));
        emit ContractUpdated(contractId, action);
    }

    function createContract(
        bytes6 _uniqueIdentifier,
        PersonalInfo memory _landlord,
        PersonalInfo memory _tenant,
        HouseDetails memory _houseDetails,
        string memory _agreementDetails,
        string[] memory _tenantAgreements,
        string[] memory _landlordResponsibilities,
        string[] memory _agreementsBetweenLandlord,
        string memory _landlordSignature,
        string memory _tenantSignature
       // string memory _password

    ) public {
        require(contractOwners[_uniqueIdentifier] == address(0), "Contract with given identifier already exists");

        ContractTerms memory newContract = ContractTerms(
            block.timestamp,
            _landlord,
            _tenant,
            _houseDetails,
            _agreementDetails,
            _tenantAgreements,
            _landlordResponsibilities,
            _agreementsBetweenLandlord,
            _landlordSignature,
            _tenantSignature
           // _password
        );

        contracts[_uniqueIdentifier] = newContract;
        contractOwners[_uniqueIdentifier] = msg.sender;
        _recordAuditTrail(_uniqueIdentifier, "Contract created");
    }

   // function getContract(bytes6 contractId, string memory _password) public view returns (ContractTerms memory) {
    function getContract(bytes6 contractId) public view returns (ContractTerms memory) {
               // Check if the password matches
        //require(keccak256(abi.encodePacked(contracts[contractId].password)) == keccak256(abi.encodePacked(_password)), "Incorrect password");
        return contracts[contractId];
    }

    function updateContract(
        bytes6 contractId,
       // string memory action,
        string memory _agreementDetails,
        string[] memory _tenantAgreements,
        string[] memory _landlordResponsibilities,
        string[] memory _agreementsBetweenLandlord,
        string memory _landlordSignature,
        string memory _tenantSignature
    ) public onlyLandlord(contractId) recordAuditTrail(contractId, "Contract updated") {
        ContractTerms storage contractToUpdate = contracts[contractId];
        contractToUpdate.agreementDetails = _agreementDetails;
        contractToUpdate.tenantAgreements = _tenantAgreements;
        contractToUpdate.landlordResponsibilities = _landlordResponsibilities;
        contractToUpdate.agreementsBetweenLandlord = _agreementsBetweenLandlord;
        contractToUpdate.landlordSignature = _landlordSignature;
        contractToUpdate.tenantSignature = _tenantSignature;
        _recordAuditTrail(contractId, "Contract updated");
    
    }

        function _recordAuditTrail(bytes6 contractId, string memory action) internal {
        contractAuditTrails[contractId].push(AuditTrail(block.timestamp, action, msg.sender));
        emit ContractUpdated(contractId, action);
    }
    
    // Function to get the audit trail for a contract
    function getContractAuditTrail(bytes6 contractId) public view returns (AuditTrail[] memory) {
        return contractAuditTrails[contractId];
    }


function signContract(bytes6 contractId, string memory _tenantSignature) public onlyTenant(contractId) {
    // Update the tenant's signature
    ContractTerms storage contractToUpdate = contracts[contractId];
    contractToUpdate.tenantSignature = _tenantSignature;
}
}
