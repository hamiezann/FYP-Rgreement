const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("HouseRentalContract", function () {
  let HouseRentalContract, houseRentalContract, landlord, tenant;
  let contractId, landlordInfo, tenantInfo, houseDetails;

  beforeEach(async function () {
    [landlord, tenant] = await ethers.getSigners();
    HouseRentalContract = await ethers.getContractFactory("HouseRentalContract");
    houseRentalContract = await HouseRentalContract.deploy();
    await houseRentalContract.waitForDeployment();

    contractId = ethers.id("uniqueIdentifier").slice(0, 14); // bytes6 representation in v6

    landlordInfo = {
      name: "Landlord Name",
      identificationNumber: "12345",
      house_address: "Landlord House Address"
    };

    tenantInfo = {
      name: "Tenant Name",
      identificationNumber: "67890",
      house_address: "Tenant House Address",
      walletAddress: tenant.address // Hardcoded tenant address
    };

    houseDetails = {
      rent_address: "House Rent Address",
      buildingType: "Apartment",
      rentPeriod: 12,
      effectiveStartDate: Math.floor(Date.now() / 1000), // current timestamp
      effectiveEndDate: Math.floor(Date.now() / 1000) + 31556952, // 1 year later
      monthlyRent: ethers.parseUnits("1", "ether"), // 1 ETH
      paymentMethod: "ETH",
      maxOverduePeriod: 7,
      deposit: ethers.parseUnits("2", "ether"), // 2 ETH
      latitude: 123456,
      longitude: 654321
    };
  });

  it("Should create a contract", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    const contract = await houseRentalContract.getContract(contractId, "password123");
    expect(contract.landlord.name).to.equal("Landlord Name");
  });

  it("Should not create a contract with an existing ID", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await expect(
      houseRentalContract.createContract(
        contractId,
        landlordInfo,
        tenantInfo,
        houseDetails,
        "Agreement Details",
        ["Tenant Agreement 1"],
        ["Landlord Responsibility 1"],
        ["Agreement Between Landlord 1"],
        "Landlord Signature",
        "Tenant Signature",
        "password123"
      )
    ).to.be.revertedWith("Contract with given identifier already exists");
  });

  it("Should get the contract details with the correct password", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    const contract = await houseRentalContract.getContract(contractId, "password123");
    expect(contract.landlord.name).to.equal("Landlord Name");
  });

  it("Should fail to get contract details with an incorrect password", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await expect(
      houseRentalContract.getContract(contractId, "wrongpassword")
    ).to.be.revertedWith("Incorrect password");
  });

  it("Should update the contract", async function () {
    await houseRentalContract.createContract(
        contractId,
        landlordInfo,
        tenantInfo,
        houseDetails,
        "Agreement Details",
        ["Tenant Agreement 1"],
        ["Landlord Responsibility 1"],
        ["Agreement Between Landlord 1"],
        "Landlord Signature",
        "Tenant Signature",
        "password123"
    );

    await houseRentalContract.connect(landlord).updateContract(
        contractId,
        "password123",
        "Updated Agreement Details",
        ["Updated Tenant Agreement 1"],
        ["Updated Landlord Responsibility 1"],
        ["Updated Agreement Between Landlord 1"],
        "Updated Landlord Signature",
        "Updated Tenant Signature",
        tenantInfo.walletAddress, // Use the hardcoded tenant address
        Math.floor(Date.now() / 1000), // new start date
        Math.floor(Date.now() / 1000) + 31556952 // new end date
    );

    const contract = await houseRentalContract.getContract(contractId, "password123");

    // Display the tenant address
    console.log("Tenant Address:", tenantInfo.walletAddress);

    expect(contract.agreementDetails).to.equal("Updated Agreement Details");
});


it("Should sign the contract and hold the deposit", async function () {
    // console.log("Signer Address:", await tenant.getAddress());
    await houseRentalContract.createContract(
        contractId,
        landlordInfo,
        tenantInfo,
        houseDetails,
        "Agreement Details",
        ["Tenant Agreement 1"],
        ["Landlord Responsibility 1"],
        ["Agreement Between Landlord 1"],
        "Landlord Signature",
        "Tenant Signature",
        "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
        contractId,
        "password123",
        tenantInfo.name,
        tenantInfo.identificationNumber,
        tenantInfo.house_address,
        "Tenant Signature",
        { value: houseDetails.deposit }
    );

    const contract = await houseRentalContract.getContract(contractId, "password123");

    // Display the signer address
    console.log("Signer Address:", await tenant.getAddress());

    // expect(contract.tenantSignature).to.equal("Tenant Signature");
    // expect(contract.tenantAddress).to.equal("Tenant Signature");
    expect(contract.depositPaid).to.be.true;
});


  it("Should request a deposit release", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
      contractId,
      "password123",
      tenantInfo.name,
      tenantInfo.identificationNumber,
      tenantInfo.house_address,
      "Tenant Signature",
      { value: houseDetails.deposit }
    );

    await houseRentalContract.connect(landlord).requestDepositRelease(contractId, ethers.parseUnits("1", "ether"), 0);

    const requests = await houseRentalContract.getDepositReleaseRequests(contractId);
    expect(requests[0].amount).to.equal(ethers.parseUnits("1", "ether"));
    expect(requests[0].active).to.be.true;
  });

  it("Should approve a deposit release", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
      contractId,
      "password123",
      tenantInfo.name,
      tenantInfo.identificationNumber,
      tenantInfo.house_address,
      "Tenant Signature",
      { value: houseDetails.deposit }
    );

    await houseRentalContract.connect(landlord).requestDepositRelease(contractId, ethers.parseUnits("1", "ether"), 0);

    await houseRentalContract.connect(tenant).approveDepositRelease(contractId, 0);

    const requests = await houseRentalContract.getDepositReleaseRequests(contractId);
    expect(requests[0].active).to.be.false;
  });

  it("Should reject a deposit release", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
      contractId,
      "password123",
      tenantInfo.name,
      tenantInfo.identificationNumber,
      tenantInfo.house_address,
      "Tenant Signature",
      { value: houseDetails.deposit }
    );

    await houseRentalContract.connect(landlord).requestDepositRelease(contractId, ethers.parseUnits("1", "ether"), 0);

    await houseRentalContract.connect(tenant).rejectDepositRelease(contractId, 0);

    const requests = await houseRentalContract.getDepositReleaseRequests(contractId);
    expect(requests[0].active).to.be.false;
  });

  it("Should end the contract", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
      contractId,
      "password123",
      tenantInfo.name,
      tenantInfo.identificationNumber,
      tenantInfo.house_address,
      "Tenant Signature",
      { value: houseDetails.deposit }
    );

    await houseRentalContract.connect(landlord).endContract(contractId);

    const contract = await houseRentalContract.getContract(contractId, "password123");
    expect(contract.contractActive).to.be.false;
  });

  it("Should refund the deposit after contract ends", async function () {
    await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
    );

    await houseRentalContract.connect(tenant).signContract(
      contractId,
      "password123",
      tenantInfo.name,
      tenantInfo.identificationNumber,
      tenantInfo.house_address,
      "Tenant Signature",
      { value: houseDetails.deposit }
    );

    await ethers.provider.send("evm_increaseTime", [31556952]); // Increase time by 1 year
    await ethers.provider.send("evm_mine", []);

    await houseRentalContract.connect(landlord).refundDeposit(contractId);

    const contract = await houseRentalContract.getContract(contractId, "password123");
    expect(contract.depositReleased).to.be.true;
  });

  it("Should retrieve the contract with the correct password", async function () {
    await houseRentalContract.createContract(
        contractId,
        landlordInfo,
        tenantInfo,
        houseDetails,
        "Agreement Details",
        ["Tenant Agreement 1"],
        ["Landlord Responsibility 1"],
        ["Agreement Between Landlord 1"],
        "Landlord Signature",
        "Tenant Signature",
        "password123"
    );

    const contract = await houseRentalContract.getContract(contractId, "password123");
    
    // Display retrieved contract details
    console.log("Retrieved Contract with Correct Password:", contract);

    expect(contract.agreementDetails).to.equal("Agreement Details");
});

it("Should not retrieve the contract with an incorrect password", async function () {
  await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
  );

  try {
      await houseRentalContract.getContract(contractId, "wrongpassword");
      assert.fail("The contract retrieval should have thrown an error");
  } catch (error) {
      console.log("Error when using incorrect password:", error.message);
      assert.include(error.message, "Incorrect password", "Error message should contain 'Incorrect password'");
  }
});

it("Should not retrieve the contract with brute force attempts", async function () {
  await houseRentalContract.createContract(
      contractId,
      landlordInfo,
      tenantInfo,
      houseDetails,
      "Agreement Details",
      ["Tenant Agreement 1"],
      ["Landlord Responsibility 1"],
      ["Agreement Between Landlord 1"],
      "Landlord Signature",
      "Tenant Signature",
      "password123"
  );

  // Array of incorrect passwords
  const incorrectPasswords = [
      "password1",
      "password2",
      "password3",
      "password4",
      "password5",
      "password6",
      "password7",
      "password8",
      "password9",
      "password10"
  ];

  for (let i = 0; i < incorrectPasswords.length; i++) {
      try {
          await houseRentalContract.getContract(contractId, incorrectPasswords[i]);
          assert.fail("The contract retrieval should have thrown an error");
      } catch (error) {
          console.log(`Error when using incorrect password '${incorrectPasswords[i]}':`, error.message);
          assert.include(error.message, "Incorrect password", "Error message should contain 'Incorrect password'");
      }
  }

  // Finally, retrieve with the correct password to ensure it still works
  const contract = await houseRentalContract.getContract(contractId, "password123");
  console.log("Retrieved Contract with Correct Password after brute force attempts:", contract);
  expect(contract.agreementDetails).to.equal("Agreement Details");
});


});
