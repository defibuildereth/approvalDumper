require('dotenv').config()
const { ethers } = require("ethers");

let baseEndpoint = "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_BASESCAN_API_KEY;

const PROVIDER = {
    BASE: new ethers.providers.JsonRpcProvider(baseEndpoint)
};

module.exports= PROVIDER;