const hre = require("hardhat");

async function main() {
  const RentalContract = await hre.ethers.getContractFactory("RentalContract");
  //const RentalContract = await hre.ethers.getContractFactory("UpdatedRentalContract");
  const UpdatedRentalContract = await hre.ethers.getContractFactory("UpdatedRentalContract");
  console.log("Deploying RentalContract contract...");
  const rentalContract = await RentalContract.deploy();
  const updatedrentalContract = await UpdatedRentalContract.deploy();
  // Wait for the contract to be deployed and get deployed instance
 // await rentalContract.deployTransaction.wait();

  console.log("RentalContract contract deployed successfully!");
  console.log("RentalContract contract address:", rentalContract.target);
  console.log("UpdatedRentalContract contract address:", updatedrentalContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying RentalContract contract:", error);
    process.exit(1);
  });
