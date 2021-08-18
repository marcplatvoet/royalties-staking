// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

//import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
//import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
//import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
//import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MyToken {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply = 10000 * 10**18;
    string public name = "MyToken";
    string public symbol = "MTN";
    uint8 public decimals = 18;
    address public admin;
    address public _artist;
    uint256 public _percentage;

    constructor() {
        admin = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "balance too low");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        require(balanceOf(from) >= value, "balance too low");
        require(allowance[from][msg.sender] >= value, "allowance too low");
        balances[from] -= value;
        balances[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != msg.sender);
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function addRoyaltiesAccount(address artist, uint256 percentage)
        public
        returns (bool)
    {
        require(admin == msg.sender, "Only the owner can use this function");
        _artist = artist;
        _percentage = percentage;
        return true;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function getArtist() public view returns (address) {
        return _artist;
    }

    function getPercentage() public view returns (uint256) {
        return _percentage;
    }

    function transferWithRoyalies(address to, uint256 value)
        public
        returns (bool)
    {
        require(balances[msg.sender] >= value, "balance too low");
        balances[msg.sender] -= value;
        uint256 royaltyval = (value / 100) * _percentage;
        balances[_artist] += royaltyval;
        balances[to] += (value - royaltyval);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function mint(uint256 value) public returns (bool) {
        require(balances[admin] >= value, "balance too low");
        balances[admin] -= value;
        balances[msg.sender] += value;
        emit Transfer(admin, msg.sender, value);
        return true;
    }
}
