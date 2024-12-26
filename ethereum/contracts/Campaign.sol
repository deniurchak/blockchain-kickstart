// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint countApproved;
        mapping(address => bool) approvals;
    }

    uint requestCount;
    uint approversCount;

    mapping(uint => Request) public requests;
    address public manager;

    uint public minimumContribution;
    mapping(address => bool) public approvers;


    modifier managerOnly() {
        require(msg.sender == manager, "this function is manager-only");
        _;
    }

    modifier contributorOnly() {
        require(approvers[msg.sender], "this function is contributorOnly-only");
        _;
    }

    constructor(uint minimum, address managerAddress) {
        manager = managerAddress;
        minimumContribution = minimum;
        requestCount = 1;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "contribution must be greater or equal than minimum");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public managerOnly {

        Request storage newRequest = requests[requestCount];

        // Initialize the fields individually
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.countApproved = 0;

        requestCount++;
    }

    function approveRequest(uint requestId) public contributorOnly {
        Request storage requestToApprove = requests[requestId];
        require(requestId < requestCount, "Request does not exist");
        require(!requestToApprove.approvals[msg.sender], "you have already approved the request");

        requestToApprove.approvals[msg.sender] = true;
        requestToApprove.countApproved++;
    }

    function finalizeRequest(uint requestId) public managerOnly {
        Request storage requestToFinalize = requests[requestId];
        require(requestId < requestCount, "Request does not exist");
        require(!requestToFinalize.complete, "this request is already complete");
        require(requestToFinalize.countApproved > (approversCount / 2), "this request doesn't have approvaer majority");

        requestToFinalize.recipient.transfer(requestToFinalize.value);

        requestToFinalize.complete = true;
    }
}
