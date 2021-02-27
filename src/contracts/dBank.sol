// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {
    //assign Token contract to variable
    Token private token;

    //add mappings
    mapping(address => uint256) public etherBalanceOf;
    mapping(address => uint256) public depositStart;
    mapping(address => bool) public isDeposited;

    //add events
    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        //assign token deployed contract to variable
        token = _token;
    }

    function deposit() public payable {
        //check if msg.sender didn't already deposited funds
        require(
            isDeposited[msg.sender] == false,
            "Error, deposit already active"
        );
        //check if msg.value is >= than 0.01 ETH
        require(msg.value >= 1e16, "Error, deposit must be >=0.o1 ETH");

        //increase msg.sender ether deposit balance
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
        //start msg.sender hodling time
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

        //set msg.sender deposit status to true
        isDeposited[msg.sender] = true; //active deposit status
        //emit Deposit event
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        //check if msg.sender deposit status is true
        //assign msg.sender ether deposit balance to variable for event
        //check user's hodl time
        //calc interest per second
        //calc accrued interest
        //send eth to user
        msg.sender.transfer(etherBalanceOf[msg.sender]);
        //send interest in tokens to user

        //reset depositer data
        etherBalanceOf[msg.sender]=0;
        //emit event
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}
