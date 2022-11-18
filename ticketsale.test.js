const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');

let accounts;
let ticketSale;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  ticketSale = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [100, 1] // constructor required fields,
    })
    .send({ from: accounts[0], gasPrice: 150000, gas: 4700000 });
});

describe("TicketSale", () => {
  it("deploys a contract with owner", async () =>{
    assert.ok(ticketSale.options.address);
  });
  it("verify purchase", async () => {
    ticketSale.methods.buyTicket(2).send({ from: accounts[1], value: 100000, gasPrice: 1500000, gas: 4700000});
    const ticketId = await ticketSale.methods.getTicketOf(accounts[1]).call();
    assert.equal(ticketId, 2);
  });
  it("Allows swap", async () => { // tests accept and offer swap
    ticketSale.methods.buyTicket(10).send({from: accounts[1], value: 100000, gasPrice: 1500000, gas: 4700000});
    ticketSale.methods.buyTicket(20).send({from: accounts[2], value: 100000, gasPrice: 1500000, gas: 4700000});
    ticketSale.methods.offerSwap(accounts[1]).send({from: accounts[2]});
    ticketSale.methods.acceptSwap(account[2]).send({from: accounts[1]});
    const id = await ticketSale.methods.getTicketOf(accounts[1]).call();
    const id2 = await ticketSale.methods.getTicketOf(accounts[2]).call();
    assert.equal(id, 20);
    assert.equal(id2,10);
  });

});
