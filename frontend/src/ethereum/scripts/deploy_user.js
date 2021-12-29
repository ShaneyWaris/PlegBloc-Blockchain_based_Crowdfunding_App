require("dotenv").config({
  path: "../../../.env",
});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs-extra");
const path = require("path");

const compiledUserFactory = require("../build/User.json");

const provider = new HDWalletProvider(
  process.env.REACT_APP_MNEMONIC,
  process.env.REACT_APP_LINK
);
const web3 = new Web3(provider);

const deployedAddressPath = path.resolve(
  __dirname,
  "../scripts/address_user.js"
);

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account: ${accounts[2]}`);

  const deployedFactory = await new web3.eth.Contract(compiledUserFactory.abi)
    .deploy({
      data: "0x" + compiledUserFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[2],
      gas: "2000000",
    });

  console.log(
    `Campaign Factory deployed at address: ${deployedFactory.options.address}`
  );

  fs.removeSync(deployedAddressPath);
  fs.writeFileSync(
    deployedAddressPath,
    `module.exports = "${deployedFactory.options.address}";`
  );
  console.log(
    "Successfully deployed, contract address now accessible in address.js"
  );
  provider.engine.stop();
})();
