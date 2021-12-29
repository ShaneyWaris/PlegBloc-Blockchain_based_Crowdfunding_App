// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Main{

    address[] public deployed_factories;
    User_manager manager;

    constructor(){
        manager = new User_manager();
    }
    function registerUser(string memory email, string memory password, string memory name, string memory phone) public{
        address factory = address(new CampaignFactory());
        manager.register(email, password, name, phone, factory);
        deployed_factories.push(factory);
    }

    function get_deployed_factories() public view returns(address[] memory){
        return deployed_factories;
    }

    function login(string memory email, string memory password)
        public
        view
        returns (int256 count)
    {
        return manager.login(email, password);
    }

    function get_name(string memory email, string memory password)
        public
        view
        returns (string memory name)
    {
        return manager.get_name(email, password);
    }

    function get_mobile(string memory email, string memory password)
        public
        view
        returns (string memory mobile)
    {
        return manager.get_mobile(email, password);
    }

    function get_factory(string memory email, string memory password)
        public
        view
        returns (address factory)
    {
        return manager.get_factory(email, password);
    }
}

contract User_manager {
    mapping(string => bytes32) private U_Password;
    mapping(string => string) private U_mobile;
    mapping(string => string) private U_name;
    mapping(string => address) private U_factory;

    function register(
        string memory email,
        string memory password,
        string memory name,
        string memory mobile,
        address factory
    ) public {
        U_Password[email] = keccak256(bytes(password));
        U_name[email] = name;
        U_mobile[email] = mobile;
        U_factory[email] = factory;
    }

    function is_valid( string memory email, string memory password) internal view returns (bool){
        bytes32 actual = U_Password[email];
        bytes32 curr = keccak256(bytes(password));
        return actual == curr;
    }

    function login(string memory email, string memory password)
        public
        view
        returns (int256 count)
    {
        if (  is_valid(email, password) ) {
            return 69;
        }
        return -69;
    }

    function get_name(string memory email, string memory password)
        public
        view
        returns (string memory name)
    {
        if(is_valid(email, password)){
            return U_name[email];
        }
        return "";
    }

    function get_mobile(string memory email, string memory password)
        public
        view
        returns (string memory mobile)
    {
        if(is_valid(email, password)){
            return U_mobile[email];
        }
        return "";
    }

    function get_factory(string memory email, string memory password)
        public
        view
        returns (address factory)
    {
        if(is_valid(email, password)){
            return U_factory[email];
        }
        return address(0);
    }
    
}

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
    function createCampaign(string memory email, string memory name, string memory description, uint min_c, uint target_amt) public{
        address new_campaign = address(new Campaign(email, name, description, min_c, target_amt, msg.sender));
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
    string public creator_email;
    string public name;
    string public c_description;
    uint public minimum_contribution;
    uint public target_amount;
    bool public isActive;
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
    constructor (string memory email, string memory _name, string memory _description, uint min_c, uint target_amt, address manager) {
        creator = manager;
        creator_email = email;
        name = _name;
        c_description = _description;
        minimum_contribution = min_c;
        target_amount = target_amt;
        isActive = true;
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
