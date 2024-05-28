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
        uint effectiveStartDate;
        uint effectiveEndDate;
        uint monthlyRent;
        string paymentMethod;
        uint maxOverduePeriod;
        uint deposit;
        // uint utilityDeposit;
        // uint advanceRental;
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
        string password;
        address tenantAddress;
        bool depositPaid;
        bool depositReleased;
        bool contractActive;
    }

    mapping(bytes6 => ContractTerms) public contracts;
    mapping(bytes6 => address) public contractOwners;

    modifier onlyLandlord(bytes6 contractId) {
        require(contractOwners[contractId] == msg.sender, "Only landlord can perform this action");
        _;
    }

    modifier onlyTenant(bytes6 contractId) {
        require(contracts[contractId].tenantAddress == msg.sender, "Only the tenant can perform this action");
        _;
    }

    event ContractCreated(bytes6 indexed contractId, address indexed owner, uint timestamp);
    event ContractUpdated(bytes6 indexed contractId, uint timestamp);
    event ContractSigned(bytes6 indexed contractId, uint timestamp);
    event DepositPaid(bytes6 indexed contractId, uint amount, uint timestamp);
    event DepositReleaseRequested(bytes6 indexed contractId, uint amount, uint timestamp);
    event DepositReleased(bytes6 indexed contractId, uint amount, uint timestamp);
    event ContractEnded(bytes6 indexed contractId, uint timestamp);

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
        string memory _tenantSignature,
        string memory _password
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
            _tenantSignature,
            _password,
            address(0),
            false,
            false,
            false
        );

        contracts[_uniqueIdentifier] = newContract;
        contractOwners[_uniqueIdentifier] = msg.sender;

        emit ContractCreated(_uniqueIdentifier, msg.sender, block.timestamp);
    }

    function getContract(bytes6 contractId, string memory _password) public view returns (ContractTerms memory) {
        require(keccak256(abi.encodePacked(contracts[contractId].password)) == keccak256(abi.encodePacked(_password)), "Incorrect password");
        return contracts[contractId];
    }

    function updateContract(
        bytes6 contractId,
        string memory _password,
        string memory _agreementDetails,
        string[] memory _tenantAgreements,
        string[] memory _landlordResponsibilities,
        string[] memory _agreementsBetweenLandlord,
        string memory _landlordSignature,
        string memory _tenantSignature,
        address _tenantAddress,
        uint _effectiveStartDate,
        uint _effectiveEndDate
    ) public onlyLandlord(contractId) {
        require(keccak256(abi.encodePacked(contracts[contractId].password)) == keccak256(abi.encodePacked(_password)), "Incorrect password");
        ContractTerms storage contractToUpdate = contracts[contractId];
        contractToUpdate.agreementDetails = _agreementDetails;
        contractToUpdate.tenantAgreements = _tenantAgreements;
        contractToUpdate.landlordResponsibilities = _landlordResponsibilities;
        contractToUpdate.agreementsBetweenLandlord = _agreementsBetweenLandlord;
        contractToUpdate.landlordSignature = _landlordSignature;
        contractToUpdate.tenantSignature = _tenantSignature;
        contractToUpdate.tenantAddress = _tenantAddress;
        contractToUpdate.houseDetails.effectiveStartDate = _effectiveStartDate;
        contractToUpdate.houseDetails.effectiveEndDate = _effectiveEndDate;

        emit ContractUpdated(contractId, block.timestamp);
    }

    function signContract(
        bytes6 contractId,
        string memory _password,
        string memory _name,
        string memory _identificationNumber,
        string memory _houseAddress,
        string memory _tenantSignature
    ) public payable onlyTenant(contractId) {
        require(keccak256(abi.encodePacked(contracts[contractId].password)) == keccak256(abi.encodePacked(_password)), "Incorrect password");
        require(msg.value == contracts[contractId].houseDetails.deposit, "Incorrect deposit amount");

        ContractTerms storage contractToUpdate = contracts[contractId];
        contractToUpdate.tenant.name = _name;
        contractToUpdate.tenant.identificationNumber = _identificationNumber;
        contractToUpdate.tenant.house_address = _houseAddress;
        contractToUpdate.tenantSignature = _tenantSignature;
        contractToUpdate.depositPaid = true;
        contractToUpdate.contractActive = true;

        emit ContractSigned(contractId, block.timestamp);
        emit DepositPaid(contractId, msg.value, block.timestamp);
    }

    function requestDepositRelease(bytes6 contractId, uint amount) public onlyLandlord(contractId) {
        require(contracts[contractId].depositPaid, "Deposit not paid");
        require(!contracts[contractId].depositReleased, "Deposit already released");
        require(contracts[contractId].contractActive, "Contract not active");

        // Logic to handle disputes can be added here

        emit DepositReleaseRequested(contractId, amount, block.timestamp);
    }

    function approveDepositRelease(bytes6 contractId, uint amount) public onlyTenant(contractId) {
        require(contracts[contractId].depositPaid, "Deposit not paid");
        require(!contracts[contractId].depositReleased, "Deposit already released");
        require(contracts[contractId].contractActive, "Contract not active");

        payable(msg.sender).transfer(amount);
        contracts[contractId].depositReleased = true;
        contracts[contractId].contractActive = false;

        emit DepositReleased(contractId, amount, block.timestamp);
    }

    function endContract(bytes6 contractId) public onlyLandlord(contractId) {
        require(contracts[contractId].contractActive, "Contract not active");

        contracts[contractId].contractActive = false;
        // Additional logic to handle the end of the contract can be added here

        emit ContractEnded(contractId, block.timestamp);
    }

    function refundDeposit(bytes6 contractId) public onlyLandlord(contractId) {
        ContractTerms storage contractToUpdate = contracts[contractId];
        require(block.timestamp >= contractToUpdate.houseDetails.effectiveEndDate, "Contract not ended yet");
        require(!contractToUpdate.depositReleased, "Deposit already released");

        uint256 amount = contractToUpdate.houseDetails.deposit;
        contractToUpdate.depositPaid = false;
        contractToUpdate.depositReleased = true;

        payable(contractToUpdate.tenantAddress).transfer(amount);

        emit DepositReleased(contractId, amount, block.timestamp);
    }
}
