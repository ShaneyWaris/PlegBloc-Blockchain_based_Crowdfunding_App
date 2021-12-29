// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FactoryStore{
    string[] public deployed_factories;

    function addFactory(string memory factory) public{
        deployed_factories.push(factory);
    }

    function getDeployedFactories() public view returns(string[] memory){
        return deployed_factories;
    }
}