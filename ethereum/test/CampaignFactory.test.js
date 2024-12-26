const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/CampaignFactory.json');
const compiledCampaign = require('../build/Campaign.json');

let accounts;
let factory;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });
});

describe('Campaign Factory', () => {
    it('deploys a factory', () => {
        assert.ok(factory.options.address);
    });

    it('allows creating a new campaign', async () => {
        await factory.methods.deploy('100').send({
            from: accounts[0],
            gas: '3000000'
        });

        const campaigns = await factory.methods.getCampaigns().call();
        assert.equal(campaigns.length, 1);
        
        const campaign = await new web3.eth.Contract(
            compiledCampaign.abi,
            campaigns[0]
        );
        
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('creates multiple campaigns from different accounts', async () => {
        await factory.methods.deploy('100').send({
            from: accounts[0],
            gas: '3000000'
        });

        await factory.methods.deploy('200').send({
            from: accounts[1], 
            gas: '3000000'
        });

        const campaigns = await factory.methods.getCampaigns().call();
        assert.equal(campaigns.length, 2);

        const campaign1 = await new web3.eth.Contract(
            compiledCampaign.abi,
            campaigns[0]
        );

        const campaign2 = await new web3.eth.Contract(
            compiledCampaign.abi,
            campaigns[1]
        );

        const manager1 = await campaign1.methods.manager().call();
        const manager2 = await campaign2.methods.manager().call();

        assert.equal(accounts[0], manager1);
        assert.equal(accounts[1], manager2);
    });
});
