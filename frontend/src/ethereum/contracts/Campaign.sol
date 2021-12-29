// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

/**
 * @title CampaignFactory
 * @dev CampaignFactory for creating campaign instances
 */
contract CampaignFactory{
    address[] public deployed_campaigns;
    
    /**
     * @dev Create new campaigns by providing minimum contribution value
     * @param min_c Minimum contribution to be made to start a campaign
     */
    function createCampaign(uint min_c) public{
        address new_campaign = address(new Campaign(min_c, msg.sender));
        deployed_campaigns.push(new_campaign);
    }
    
    /**
     * @dev Returns a list of campaigns that have been created by the message sender
     * @return list of addresses of campaigns
     */
    function getDeployedCampaigns() public view returns(address[] memory){
        return deployed_campaigns;
    }
}


/**
 * @title Campaign
 * @dev Campaign smart contract
 */
contract Campaign{
    
    /**
     * @title Request
     * @dev The Request Struct has all the parameters that define a request created by campaign manager/creator
     */
    struct Request{
        string description;
        uint value;
        address recepient;
        bool complete;
        uint yes_count;
        mapping( address => bool) approvers;
    }
    
    address public creator;
    uint public minimum_contribution;
    mapping(address => bool) public backers;
    uint backers_count; 
    Request[] public requests;
    
    /* @dev modifier to check if the caller is the campaign creator/manager
    */
    modifier restrict_to_creator(){
        require(msg.sender == creator);
        _;
    }
    
    /**
     * @dev Constructor of the campaign
     * @param min_c minimum contribution to start the campaign
     * @param manager the address of the campaign creator/manager
     */
    constructor (uint min_c, address manager) {
        creator = manager;
        minimum_contribution = min_c;
        backers_count = 0;
        
    }
    
    /**
     * @dev contribute to a campaign (payable)
     */
    function contribute() public payable {
        require(msg.value >= minimum_contribution);
        backers[msg.sender] = true;
        backers_count++;
        
    }
    
    /**
     * @dev create a new_request restricted to creator
     * @param description the description telling the requirement and goals of the request
     * @param value the amount of money requested
     * @param recepient the recepient of the amount
     */
    function new_request( string memory description, uint value, address  recepient) 
    public payable restrict_to_creator {
        
        Request storage temp = requests.push();
        temp.description = description;
        temp.value = value;
        temp.recepient = recepient;
        temp.complete = false;
        temp.yes_count = 0;
        
    }
    
    /**
     * @dev approve a request at index i
     * @param i the index at which the request is to be approved
     */
    function approve_request(uint i) public {
        //i : request index in array
        Request storage curr_request = requests[i];
        require( backers[msg.sender] ); // Should be a backer         
        require( ! curr_request.approvers[msg.sender] ); //Should not have voted on this request 
        
        curr_request.approvers[msg.sender] = true;
        curr_request.yes_count++;
    }
    
    /**
     * @dev finalize the transaction after getting the required approvals restricted to creator/manager
     * @param i the index at which request is to be finalized
     */
    function make_transaction( uint i) public restrict_to_creator {
        Request storage curr_request = requests[i];
        
        require( curr_request.yes_count > (backers_count/2));
        require( ! curr_request.complete);
        
        address payable addr = payable(curr_request.recepient);
        addr.transfer( curr_request.value );
        
        curr_request.complete = true;
    }
}

