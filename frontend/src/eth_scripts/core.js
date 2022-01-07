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

export { injectMetaMask, detectProvider, createCampaign };
