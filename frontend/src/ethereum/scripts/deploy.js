require("dotenv").config({
  path: "../../../.env",
});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs-extra");
const path = require("path");

const compiledCampaign = require("../build/Campaign.json");

const provider = new HDWalletProvider(
  process.env.REACT_APP_MNEMONIC,
  process.env.REACT_APP_LINK
);
const web3 = new Web3(provider);

const deployedAddressPath = path.resolve(__dirname, "../scripts/address.js");

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account: ${accounts[1]}`);

  const deployedCampaign = await new web3.eth.Contract(compiledCampaign.abi)
    .deploy({
      data: "0x" + compiledCampaign.evm.bytecode.object,
      arguments: ["100"],
    })
    .send({
      from: accounts[1],
      gas: "2000000",
    });

  console.log(
    `Campaign deployed at address: ${deployedCampaign.options.address}`
  );

  fs.removeSync(deployedAddressPath);
  fs.writeFileSync(
    deployedAddressPath,
    `module.exports = "${deployedCampaign.options.address}";`
  );
  console.log(
    "Successfully deployed, contract address now accessible in address.js"
  );
  provider.engine.stop();
})();
