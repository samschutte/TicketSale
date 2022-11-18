const Web3 = require("web3");
const {abi, bytecode} = require('./compile');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(
  'loyal hour symptom dash urban angle proof final gospel neither river artist',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/8c3ef6d01b09437ea83a891158175ee4'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [100,1] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', inbox.options.address);
  provider.engine.stop();
};
deploy();
