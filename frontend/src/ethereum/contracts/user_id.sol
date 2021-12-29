// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract User {
    mapping(string => bytes32) private U_Password;
    mapping(string => string) private U_mobile;
    mapping(string => string) private U_name;
    mapping(string => string) private U_factory;

    function register(
        string memory email,
        string memory password,
        string memory name,
        string memory mobile,
        string memory factory
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
        returns (string memory factory)
    {
        if(is_valid(email, password)){
            return U_factory[email];
        }
        return "";
    }
    
}
