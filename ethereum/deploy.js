const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

require('dotenv').config();

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA_ENDPOINT
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '3000000' });

  console.log('Contract deployed to', factory.options.address);
  provider.engine.stop();
};

deploy();
