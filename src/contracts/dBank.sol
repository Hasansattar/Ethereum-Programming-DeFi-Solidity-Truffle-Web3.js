// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {
    //assign Token contract to variable
    Token private token; //1-

    //add mappings
    mapping(address => uint256) public etherBalanceOf; //store ether balance 2-
    mapping(address => uint256) public depositStart; // 3-
    mapping(address => bool) public isDeposited; // 4-

    //add events
    //we use events to track certain activites happen on the blockchain
    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart); // 5-
    event Withdraw(address indexed user, uint256 etherAmount, uint256 depositTime, uint256 interest
    ); //15

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        //assign token deployed contract to variable
        token = _token; //1-
    }

    function deposit() public payable {
        //check if msg.sender didn't already deposited funds   7-
        require(
            isDeposited[msg.sender] == false,
            "Error, deposit already active"
        );
        //check if msg.value is >= than 0.01 ETH   7-
        require(msg.value >= 1e16, "Error, deposit must be >=0.o1 ETH");

        //increase msg.sender ether deposit balance   2-
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
        //start msg.sender hodling time   3-
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

        //set msg.sender deposit status to true 4-
        isDeposited[msg.sender] = true; //active deposit status
        //emit Deposit event   5-
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        //check if msg.sender deposit status is true
        require(isDeposited[msg.sender] == true, "Error, no previous deposit"); //13--
        //assign msg.sender ether deposit balance to variable for event
        uint256 userBalance = etherBalanceOf[msg.sender]; //for event 14-
        //check user's hodl time
        uint256 depositTime = block.timestamp - depositStart[msg.sender]; //9-

        //calc interest per second
        //31668017 - interest(10% APY) per second for min. deposit amount (0.01 ETH), cuz:
        //1e15(10% of 0.01 ETH) / 31577600 (seconds in 365.25 days)

        //(etherBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
        //for min. deposit (0.01 ETH), (etherBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
        //for deposit 0.02 ETH, (etherBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
        uint256 interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16); //10-
        //calc accrued interest
        uint256 interest = interestPerSecond * depositTime; //10-

        //send eth to user 8-
        msg.sender.transfer(userBalance);
        //send interest in tokens to user
        token.mint(msg.sender, interest); //11-
        //reset depositer data 2-
        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0; //12-
        isDeposited[msg.sender] = false; //12-
        //emit event

        emit Withdraw(msg.sender, userBalance, depositTime, interest); //15-
    }
}
