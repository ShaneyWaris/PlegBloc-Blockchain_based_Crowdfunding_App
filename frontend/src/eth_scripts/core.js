import Web3 from "web3";
import compiledCampaign from "../ethereum/build/Campaign.json";

async function injectMetaMask() {
  const provider = detectProvider();
  if (provider) {
    if (provider !== window.ethereum) {
      console.error(
        "Not window.ethereum provider. Do you have multiple wallets installed ?"
      );
    }
    await provider.request({
      method: "eth_requestAccounts",
    });
  }
}

const detectProvider = () => {
  let provider;
  if (window.ethereum) {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    alert("Provider is not available. Check out Metamask!");
  }
  return provider;
};

const createCampaign = async (min_amount) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);
  min_amount = web3.utils.toWei(min_amount, "ether");

  let campaign;
  let accounts;
  let address;

  const create_campaign = async () => {
    accounts = await web3.eth.getAccounts();

    campaign = await new web3.eth.Contract(compiledCampaign.abi)
      .deploy({
        data: "0x" + compiledCampaign.evm.bytecode.object,
        arguments: [min_amount],
      })
      .send({
        from: accounts[0],
        gas: "2000000",
      });

    address = campaign.options.address;
  };

  try {
    await create_campaign();
    return address;
  } catch {
    return "";
  }
};

const makeContribution = async (amount, campaignAddress) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);
  amount = web3.utils.toWei(amount, "ether");

  let campaign;
  let accounts;

  const make_contribution = async () => {
    accounts = await web3.eth.getAccounts();
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaignAddress
    );

    await campaign.methods.contribute().send({
      value: amount,
      from: accounts[0],
    });
  };

  try {
    await make_contribution();
    return 1;
  } catch {
    return 0;
  }
};

const createRequest = async (amount, receiver_addr, campaignAddress) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);
  amount = web3.utils.toWei(amount, "ether");

  let campaign;
  let accounts;

  const create_request = async () => {
    accounts = await web3.eth.getAccounts();
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaignAddress
    );

    await campaign.methods.new_request(amount, receiver_addr).send({
      from: accounts[0],
      gas: "2000000",
    });
  };

  try {
    await create_request();
    return 1;
  } catch {
    return 0;
  }
};

const approveRequest = async (ind, campaignAddress) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let campaign;
  let accounts;

  const approve_request = async () => {
    accounts = await web3.eth.getAccounts();
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaignAddress
    );

    await campaign.methods.approve_request(ind).send({
      from: accounts[0],
      gas: "2000000",
    });
  };

  try {
    await approve_request();
    return 1;
  } catch {
    return 0;
  }
};

export {
  injectMetaMask,
  detectProvider,
  createCampaign,
  makeContribution,
  createRequest,
  approveRequest,
};
