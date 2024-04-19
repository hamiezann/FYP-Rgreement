// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalContract {
    struct Contract {
        string party;
        string land_address;
        uint rentFee;
        uint rentDuration;
        string terms;
        uint deposit;
    }

    Contract[] public contracts;

    function createContract(string memory _party, string memory _address, uint _rentFee, uint _rentDuration, string memory _terms, uint _deposit) public {
        Contract memory newContract = Contract(_party, _address, _rentFee, _rentDuration, _terms, _deposit);
        contracts.push(newContract);
    }

    function getContract(uint _index) public view returns (string memory, string memory, uint, uint, string memory, uint) {
        return (
            contracts[_index].party,
            contracts[_index].land_address,
            contracts[_index].rentFee,
            contracts[_index].rentDuration,
            contracts[_index].terms,
            contracts[_index].deposit
        );
    }

    function getTotalContracts() public view returns (uint) {
        return contracts.length;
    }
}
