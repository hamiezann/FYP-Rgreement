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
    }

    mapping(bytes6 => ContractTerms) public contracts;
    mapping(bytes6 => address) public contractOwners;

    modifier onlyLandlord(bytes6 contractId) {
        require(contractOwners[contractId] == msg.sender, "Only landlord can perform this action");
        _;
    }

modifier onlyTenant(bytes6 contractId) {
    require(msg.sender == address(bytes20(bytes(contracts[contractId].tenant.house_address))), "Only the tenant can perform this action");
    _;
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
        );

        contracts[_uniqueIdentifier] = newContract;
        contractOwners[_uniqueIdentifier] = msg.sender;
    }

    function getContract(bytes6 contractId) public view returns (ContractTerms memory) {
        return contracts[contractId];
    }

    function updateContract(
        bytes6 contractId,
        string memory _agreementDetails,
        string[] memory _tenantAgreements,
        string[] memory _landlordResponsibilities,
        string[] memory _agreementsBetweenLandlord,
        string memory _landlordSignature,
        string memory _tenantSignature
    ) public onlyLandlord(contractId) {
        ContractTerms storage contractToUpdate = contracts[contractId];
        contractToUpdate.agreementDetails = _agreementDetails;
        contractToUpdate.tenantAgreements = _tenantAgreements;
        contractToUpdate.landlordResponsibilities = _landlordResponsibilities;
        contractToUpdate.agreementsBetweenLandlord = _agreementsBetweenLandlord;
        contractToUpdate.landlordSignature = _landlordSignature;
        contractToUpdate.tenantSignature = _tenantSignature;
    }


function signContract(bytes6 contractId, string memory _tenantSignature) public onlyTenant(contractId) {
    // Update the tenant's signature
    ContractTerms storage contractToUpdate = contracts[contractId];
    contractToUpdate.tenantSignature = _tenantSignature;
}
}
