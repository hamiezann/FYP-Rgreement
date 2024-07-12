// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("HouseRentalContract Security Tests", function () {
//     let HouseRentalContract;
//     let houseRentalContract;
//     let owner;
//     let attacker;

//     beforeEach(async function () {
//         HouseRentalContract = await ethers.getContractFactory("HouseRentalContract");
//         [owner, attacker] = await ethers.getSigners();
//         houseRentalContract = await HouseRentalContract.deploy();
//         await houseRentalContract.deployed();
//     });

//     it("should prevent reentrancy attacks", async function () {
//         const personalInfo = {
//             name: "John Doe",
//             identificationNumber: "12345",
//             house_address: "123 Main St"
//         };
//         const houseDetails = {
//             rent_address: "123 Main St",
//             buildingType: "Apartment",
//             rentPeriod: 12,
//             effectiveStartDate: 1640995200,
//             effectiveEndDate: 1672531200,
//             monthlyRent: 1000,
//             paymentMethod: "Bank Transfer",
//             maxOverduePeriod: 30,
//             deposit: 2000,
//             latitude: 123456789,
//             longitude: 987654321
//         };
//         const agreementDetails = "Standard rental agreement.";
//         const tenantAgreements = ["No pets", "No smoking"];
//         const landlordResponsibilities = ["Maintain the garden", "Provide water"];
//         const agreementsBetweenLandlord = ["Monthly inspections"];
//         const landlordSignature = "LandlordSign";
//         const tenantSignature = "TenantSign";
//         const password = "password123";
//         const uniqueIdentifier = "ABC123";

//         await houseRentalContract.createContract(
//             uniqueIdentifier,
//             personalInfo,
//             personalInfo,
//             houseDetails,
//             agreementDetails,
//             tenantAgreements,
//             landlordResponsibilities,
//             agreementsBetweenLandlord,
//             landlordSignature,
//             tenantSignature,
//             password
//         );

//         const attackerContractFactory = await ethers.getContractFactory("ReentrancyAttack");
//         const attackerContract = await attackerContractFactory.deploy(houseRentalContract.address);
//         await attackerContract.deployed();

//         await expect(attackerContract.attack(uniqueIdentifier, { value: ethers.utils.parseEther("1") })).to.be.revertedWith("Only landlord can perform this action");
//     });
// });
