# PlegBloc
![](https://img.shields.io/gitter/room/AbhinavS99/PlegBloc) ![](https://img.shields.io/github/stars/AbhinavS99/PlegBloc?style=social)

---

## Outline
1. [Ethereum](#ethereum)
2. [Client App Sequence Diagrams](#client-app-sequence-diagrams)

---

## Ethereum
### Prologue 

> Mehak comes from a service class family. She was bright and got into electronics engineering. She was a good engineer and along with her friend Zoya she created a smart device that can be used to improve blood pressure, pulse rate, spo2 measurements remotely. 

>Annie is a middle aged banker who is a keen investor and financially aware. He has a keen interest in technology and is looking for ways to diversify his investment. 

> Rishabh is a commerce graduate from Delhi University. He wants to add a new music system to his fancy car but doesn't have enough money. The emission standards of his car are obsolete. 



### Current Scenario

* Someone gave Mehak and Zoya the idea to go to kickstarter and raise money. 
* They create a campaign, explain their project and ask random people on the internet for money. In return they promise a share of their company and free products to the backers.
* Rishabh and his friends also decide to create a campaign. They create a fake product, seeking investment for an e-commerce site. In return they promise a share of their company and discounts to their backers.
* Annie sees both the campaigns and seems interested in both of them.



### The problem

* It is possible the Mehak and Zoya fail to deliver. They will apologise to their backers and Annie gets nothing. 
* But, Rishabh can pretend to fail, take Annie's money and install a music system in his car. 

* There is no way to prevent Rishabh from scamming Annie.



### Our Solution

* Whenever there is a campaign, the backers send the money to the creator. The creator will then spend this money to implement the idea. She is likely to spend money on vendors like electrical supplies/ warehouse/ transportation/ delivery etc. 

* However, in case of scammers, they will not spend the money on vendors. It may be shopping for clothes, shoes etc., private account. In Rishabh's case, to the car decor.

* If the backers have control over spending, there is less chance of frauds.

* If Rishabh tries to spend money on Car decor, Annie can say no and save her money.



#### Contract Overview

* The goal of our contract is control how creator spends the money.
* Whenever a campaign is created, a new contract will be associated with that campaign. 
* Backers will pay the money to that contract and not the creator directly.
* Whenever creator wants to spend the money, he will create a request to withdraw money from that contract and spend to a vendor's address.
* All the backers will vote yes/no on that request. If majority votes yes, that transaction can be made.  



### Solidity  Implementation



#### Campaign

* A contract will be associated with each campaign.

##### Constructor

* We will have information like who is the creator of this campaign.

* Minimum contribution needed to be a backer. (Because people with 0 ether investment may try to sabotage the voting process ).

* ```c++
  contract Campaign{
  
      address public creator;
      uint public minimum_contribution;
      
      constructor (uint min_c ) {
          creator = msg.sender;
          minimum_contribution = min_c;
          backers_count = 0;
          
      }
  }
  ```



##### Contributing

* We keep a map of all contributors. 

* Using a map allows constant search.

* ```c++
  contract Campaign{
  ...	
      mapping(address => bool) public backers;
  ...
      function contribute() public payable {
              require(msg.value >= minimum_contribution);
              backers[msg.sender] = true;
      		value += msg.value;
              backers_count++;
              //To be done in next deadline.
      }
  ...
  }
  ```



#### Request

###### Requirements : 

* One person votes only once.
* There can be thousands of voters/backers. Using a map faster easy searches.

* Only creator can initiate request. We enforce the check using modifier. 

  * ```c
    modifier restrict_to_creator(){
        require(msg.sender == creator);
        _;
    }
    ```



* We will have a type Request, created using `struct`.
* There will be an array of requests in each Campaign.

```c++
struct Request{
    string description;
    uint value;
    address recepient;
    bool complete;
    uint yes_count;
    mapping( address => bool) approvers;
}
```



* We keep an array of requests in Campaign

```c++
contract Campaign{
	...
	Request[] requests;
	...
}

```

* `new_request` creates a new withdrawal request. 
  * Only creator can create it.
* `approve_request` votes yes on a request. 
  * Only backers can vote. 
  * They can vote only once.
* `make_transaction` Once a transaction has been made, the transfer to vendor is made here.

```
contract Campaign{
    
...
    
    function new_request( string memory description, uint value, address  recepient) 
    public payable restrict_to_creator {
        
        Request storage temp = requests.push();
        temp.description = description;
        temp.value = value;
        temp.recepient = recepient;
        temp.complete = false;
        temp.yes_count = 0;
        
    }
    
    function approve_request(uint i) public {
        //i : request index in array
        Request storage curr_request = requests[i];
        require( backers[msg.sender] ); // Should be a backer         
        require( ! curr_request.approvers[msg.sender] ); //Should not have voted on this request 
        
        curr_request.approvers[msg.sender] = true;
        curr_request.yes_count++;
    }
    
    function make_transaction( uint i) public restrict_to_creator {
        Request storage curr_request = requests[i];
        require( ! curr_request.complete);
        require( curr_request.yes_count > (backers_count/2));
        address payable addr = payable(curr_request.recepient);
        addr.transfer( curr_request.value );
        curr_request.complete = true;
    }
}
```

---

## Client App Sequence Diagrams

Create Campaign Sequence Diagram| Contribute to Campaign Sequence Diagram|
:-----------|:--------------|
![](https://github.com/AbhinavS99/PlegBloc/blob/main/images/fig1.png)|![](https://github.com/AbhinavS99/PlegBloc/blob/main/images/fig2.png)|

Create a New Request Sequence Diagram| Approve Request Sequence Diagram
:---------| :----------|
![](https://github.com/AbhinavS99/PlegBloc/blob/main/images/fig3.png)| ![](https://github.com/AbhinavS99/PlegBloc/blob/main/images/fig4.png)|
