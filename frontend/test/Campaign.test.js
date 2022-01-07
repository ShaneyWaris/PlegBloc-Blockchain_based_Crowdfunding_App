const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledCampaign = require("../../frontend/src/ethereum/build/Campaign.json");

let accounts;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  campaign = await new web3.eth.Contract(compiledCampaign.abi)
    .deploy({
      data: "0x" + compiledCampaign.evm.bytecode.object,
      arguments: ["100"],
    })
    .send({
      from: accounts[0],
      gas: "2000000",
    });
});

describe("Campaigns", () => {
  it("deploys a campaign", () => {
    assert.ok(campaign.options.address);
  });

  it("marks caller as campaign manager", async () => {
    const manager = await campaign.methods.creator().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "1000",
      from: accounts[1],
    });

    const isContributor = await campaign.methods.backers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to a make payment request", async () => {
    await campaign.methods.new_request("100", accounts[1]).send({
      from: accounts[0],
      gas: "2000000",
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal("100", request.value);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .new_request(web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "2000000",
      });

    await campaign.methods.approve_request(0).send({
      from: accounts[0],
      gas: "2000000",
    });

    await campaign.methods.make_transaction(0).send({
      from: accounts[0],
      gas: "2000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
