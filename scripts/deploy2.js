const hre = require("hardhat");

async function main() {

  const UpdatedRentalContract = await hre.ethers.getContractFactory("HouseRentalContract");
  console.log("Deploying RentalContract contract...");
  const updatedrentalContract = await UpdatedRentalContract.deploy();
  // Wait for the contract to be deployed and get deployed instance
  // await rentalContract.deployTransaction.wait();

  console.log("UpdatedRentalContract contract address:", updatedrentalContract.target);

    // Export the contract address
    // module.exports.contractAddress = updatedrentalContract.target;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying RentalContract contract:", error);
    process.exit(1);
  });
