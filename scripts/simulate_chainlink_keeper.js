const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Replace with your deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    // Get the contract instance
    const HouseRentalContract = await ethers.getContractFactory("HouseRentalContract");
    const contract = await HouseRentalContract.attach(contractAddress);

    // Periodically check and perform actions
    setInterval(async () => {
        console.log("Checking contracts...");

        const contractIds = await contract.getAllContractIds(); // Assuming you have a function to get all contract IDs

        for (const id of contractIds) {
            const contractDetails = await contract.contracts(id);
            const currentTime = Math.floor(Date.now() / 1000);

            if (contractDetails.contractActive && currentTime >= contractDetails.houseDetails.effectiveEndDate) {
                console.log(`Ending contract: ${id}`);

                // End the contract
                await contract.endContract(id, { from: deployer.address });
                console.log(`Contract ${id} ended`);

                // Refund the deposit
                await contract.refundDeposit(id, { from: deployer.address });
                console.log(`Deposit for contract ${id} refunded`);
            }
        }
    }, 60000); // Check every minute
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
