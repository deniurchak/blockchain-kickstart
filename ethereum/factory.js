import CampaignFactory from "./build/CampaignFactory.json";
import web3 from "./web3/server";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  process.env.NEXT_PUBLIC_FACTORY_ADDRESS
);

export default instance;
