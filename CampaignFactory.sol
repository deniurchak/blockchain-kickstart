// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import './Campaign.sol';

contract CampaignFactory {

    Campaign[] public deployedCampaigns;

    function deploy(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}