require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // localhost: {
    //   url: "http://localhost:8545" // Update with your local network URL
    // },
    //     myCustomNetwork: {
    //   url: "http://192.168.176.1:3000", // Update with your custom network URL
    //   // Add other network configurations as needed
    // }
  }
};
