const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Delete build folder if it exists
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Get paths to contract source files
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const factoryPath = path.resolve(__dirname, "contracts", "CampaignFactory.sol");

// Read contract source files
const campaignSource = fs.readFileSync(campaignPath, "utf8");
const factorySource = fs.readFileSync(factoryPath, "utf8");

// Configure compiler input
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: campaignSource,
    },
    "CampaignFactory.sol": {
      content: factorySource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// Compile contracts
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Create build folder and write compiled contracts
fs.ensureDirSync(buildPath);

// Extract and write the compiled contracts to build folder
const contracts = output.contracts;

for (let contract in contracts) {
  for (let contractName in contracts[contract]) {
    fs.outputJsonSync(
      path.resolve(buildPath, `${contractName}.json`),
      contracts[contract][contractName],
      { spaces: 2 }
    );
  }
}
