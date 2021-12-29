import Web3 from "web3";
import compiledFactory from "../ethereum/build/CampaignFactory.json";
import compiledUserFactory from "../ethereum/build/User.json";
import compiledCampaign from "../ethereum/build/Campaign.json";
import compiledMain from "../ethereum/build/Main.json";
import addressUser from "../ethereum/scripts/address_user";
import addressMain from "../ethereum/scripts/main_address";
import main_address from "../ethereum/scripts/main_address";

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

const get_campaigns_of = async (factory_address) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let factory;
  let campaigns;
  const create_factory = async () => {
    factory = await new web3.eth.Contract(compiledFactory.abi, factory_address);
    campaigns = await factory.methods.getDeployedCampaigns().call();
  };
  try {
    await create_factory();

    return campaigns;
  } catch {
    return [];
  }
};

const get_campaigns_at = async (campaign_address) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let campaign;
  const create_factory = async () => {
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaign_address
    );
  };
  try {
    await create_factory();

    return campaign;
  } catch {
    return null;
  }
};

const get_campaign_info = async (campaign_address) => {
  let campaign = await get_campaigns_at(campaign_address);
  // string public creator_email;
  // string public name;
  // string public c_description;
  // uint public minimum_contribution;
  // uint public target_amount;
  // bool public isActive;
  let obj = {};
  await campaign.methods
    .creator_email()
    .call()
    .then((e) => {
      obj.creator_email = e;
    });

  await campaign.methods
    .name()
    .call()
    .then((e) => {
      obj.name = e;
    });

  await campaign.methods
    .c_description()
    .call()
    .then((e) => {
      obj.c_description = e;
    });

  await campaign.methods
    .minimum_contribution()
    .call()
    .then((e) => {
      obj.minimum_contribution = e;
    });

  await campaign.methods
    .target_amount()
    .call()
    .then((e) => {
      obj.target_amount = e;
    });

  await campaign.methods
    .isActive()
    .call()
    .then((e) => {
      obj.isActive = e;
    });

  return obj;
};

const createCampaign = async (
  email,
  name,
  description,
  min_amount,
  target_amount,
  factoryAddress
) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let factory;
  let campaigns;
  let campaign;
  let accounts;
  let address;
  let flag = 0;

  const create_campaign = async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi, factoryAddress);

    await factory.methods
      .createCampaign(email, name, description, min_amount, target_amount)
      .send({
        from: accounts[0],
        gas: "2000000",
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
        flag = 1;
      });

    campaigns = await factory.methods.getDeployedCampaigns().call();
    address = campaigns.at(-1);

    campaign = await new web3.eth.Contract(compiledCampaign.abi, address);
    if (flag === 1) {
      address = -1;
    }
  };

  try {
    await create_campaign();
    return address;
  } catch {
    return "";
  }
};

const registerUser = async (email, password, name, mobile) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let accounts;
  let flag = 0;
  const register_user = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );

    await userFactory.methods
      .registerUser(email, password, name, mobile)
      .send({
        from: accounts[0],
        gas: "5000000",
      })
      .catch((error) => {
        console.log(error.message);
        flag = 1;
      });
  };

  await register_user();
  if (flag == 0) {
    return 69;
  } else {
    return -69;
  }
};

const loginUser = async (email, password) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let login_flag = 0;
  let accounts;
  const login_user = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );
    await userFactory.methods
      .login(email, password)
      .call()
      .then((e) => {
        login_flag = e;
      });
  };

  try {
    await login_user();
    console.log("Login Flag = ", login_flag);
    return login_flag;
  } catch {
    return -1;
  }
};

const getName = async (email, password) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let name = "";
  let accounts;
  const user_name = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );
    await userFactory.methods
      .get_name(email, password)
      .call()
      .then((e) => {
        name = e;
      });
  };
  try {
    await user_name();
    return name;
  } catch {
    return "";
  }
};

const getMobile = async (email, password) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let mobile = "";
  let accounts;
  const user_mobile = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );
    await userFactory.methods
      .get_mobile(email, password)
      .call()
      .then((e) => {
        mobile = e;
      });
  };
  try {
    await user_mobile();
    return mobile;
  } catch {
    return "";
  }
};

const getFactory = async (email, password) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let camp_factory = "";
  let accounts;
  const user_factory = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );
    await userFactory.methods
      .get_factory(email, password)
      .call()
      .then((e) => {
        camp_factory = e;
      });
  };
  try {
    await user_factory();
    return camp_factory;
  } catch {
    return "";
  }
};

const get_factory_addresses = async () => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let userFactory;
  let campaigns = [];
  let accounts;
  const user_factory = async () => {
    accounts = await web3.eth.getAccounts();
    const userFactoryAddress = main_address;

    userFactory = await new web3.eth.Contract(
      compiledMain.abi,
      userFactoryAddress
    );
    await userFactory.methods
      .get_deployed_factories()
      .call()
      .then((e) => {
        campaigns = e;
      });
  };
  try {
    await user_factory();
    return campaigns;
  } catch {
    return [];
  }
};

async function* campaign_factory_generator() {
  const arrays = await get_factory_addresses();
  let i = 0;
  const n = arrays.length;
  while (i < n) {
    yield arrays[i];
    i++;
  }
}
const get_campaign_addresses = async () => {
  let all_campaigns = [];
  for await (let factor_address of campaign_factory_generator()) {
    let campaigns = await get_campaigns_of(factor_address);
    for (let i = 0; i < campaigns.length; i++) {
      all_campaigns.push(campaigns[i]);
    }
  }
  return all_campaigns;
};

async function* campaign_generator() {
  const arrays = await get_campaign_addresses();
  let i = 0;
  const n = arrays.length;
  while (i < n) {
    yield arrays[i];
    i++;
  }
}

const getAllCampaigns = async () => {
  let all_campaigns = [];
  for await (let campaign_address of campaign_generator()) {
    let obj = await get_campaign_info(campaign_address);
    obj.address = campaign_address;
    all_campaigns.push(obj);
  }
  return all_campaigns;
};

const contributeToCampaign = async (amount, campaign_address) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let campaign;
  let accounts;
  let flag = 0;

  const contribute_campaign = async () => {
    accounts = await web3.eth.getAccounts();
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaign_address
    );
    await campaign.methods
      .contribute()
      .send({
        value: amount.toString(),
        from: accounts[0],
      })
      .then(() => {
        flag = 1;
      })
      .catch((e) => {
        console.log(e);
        flag = 0;
      });
  };

  await contribute_campaign();
  return flag;
};

const isUserContributor = async (campaignAddress) => {
  const provider = detectProvider();
  await provider.request({
    method: "eth_requestAccounts",
  });
  const web3 = new Web3(provider);

  let ans = false;
  let accounts;
  let campaign;

  const is_user_contrib = async () => {
    accounts = await web3.eth.getAccounts();
    campaign = await new web3.eth.Contract(
      compiledCampaign.abi,
      campaignAddress
    );

    const isContributor = await campaign.methods.backers(accounts[0]).call();
    console.log(isContributor);
    ans = isContributor;
  };
  await is_user_contrib();
  return ans;
};

export {
  injectMetaMask,
  // createCampaignFactory,
  detectProvider,
  createCampaign,
  registerUser,
  loginUser,
  getName,
  getMobile,
  getFactory,
  getAllCampaigns,
  isUserContributor,
  contributeToCampaign,
};
