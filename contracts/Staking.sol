// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    address public admin;
    uint256 public totalSupply;
    address public tokenAddress;
    IERC20 private token;

    struct StakingItem {
        uint256 amount;
        uint256 date;
    }
    mapping(address => StakingItem) public StakingItems;

    struct StakingReward {
        uint256 stakingdays;
        uint256 percentage;
    }
    StakingReward[] public StakingRewards;

    constructor(address _tokenAddress) {
        admin = msg.sender;
        tokenAddress = _tokenAddress;
        token = IERC20(tokenAddress);
        totalSupply = token.balanceOf(admin);
    }

    event eStakingCreated(address owner, uint256 amount, uint256 date);

    event eStakingReward(address owner, uint256 amount, uint256 reward);

    function addStakingRewards(uint256 stakingdays, uint256 percentage)
        external
    {
        require(
            stakingdays > 0,
            "addStakingRewards: stakingdays needs to be higher then 0."
        );
        require(
            percentage > 0,
            "addStakingRewards: percentage needs to be higher then 0."
        );

        StakingReward[] storage stakingrewards = StakingRewards;
        //100 = 1 percent
        stakingrewards.push(StakingReward(stakingdays, percentage));

        uint256 i = stakingrewards.length > 0 ? stakingrewards.length - 1 : 0;
        while (i > 0) {
            if (
                stakingrewards[i - 1].stakingdays <
                stakingrewards[i].stakingdays
            ) {
                break;
            }
            StakingReward memory stakingreward = stakingrewards[i - 1];
            stakingrewards[i - 1] = stakingrewards[i];
            stakingrewards[i] = stakingreward;
            i--;
        }
    }

    function getStakingRewards(uint256 id)
        external
        view
        returns (StakingReward memory)
    {
        require(
            StakingRewards.length > id,
            "getStakingRewards: id is outside of array. Please try a lower id."
        );
        return StakingRewards[id];
    }

    function getBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function stakingBalanceOf() external view returns (uint256) {
        require(
            StakingItems[msg.sender].amount > 0,
            "stakingBalanceOf: This address has no tokens staked!"
        );
        return StakingItems[msg.sender].amount;
    }

    function tokenBalanceOf() external view returns (uint256) {
        return token.balanceOf(msg.sender);
    }

    function getStakingByUser() external view returns (StakingItem memory) {
        require(
            StakingItems[msg.sender].amount > 0,
            "getStakingByUser: This address has no tokens staked!"
        );
        return StakingItems[msg.sender];
    }

    function createStaking(uint256 amount) external {
        require(
            amount > 0,
            "createStaking: The amount you want to stake has to be bigger than zero!"
        );
        require(
            StakingItems[msg.sender].amount == 0,
            "createStaking: This account has already staked, please get your rewards to stake again!"
        );
        token.transferFrom(msg.sender, admin, amount);
        StakingItems[msg.sender] = StakingItem(amount, block.timestamp);
        totalSupply += token.balanceOf(admin);
        emit eStakingCreated(admin, amount, block.timestamp);
    }

    function calculateReward() external view returns (uint256) {
        require(
            StakingItems[msg.sender].date > 0,
            "calculateReward: This user has not staked items."
        );
        uint256 _Percentage = StakingRewards[StakingRewards.length - 1]
            .percentage;
        uint256 stakedtime = block.timestamp - StakingItems[msg.sender].date;
        for (uint8 i = 0; i < StakingRewards.length; i++) {
            if (StakingRewards[i].stakingdays * 86400 > stakedtime) {
                _Percentage = StakingRewards[i - 1].percentage;
                break;
            }
        }
        uint256 _Reward = (StakingItems[msg.sender].amount * _Percentage) /
            10000;
        return _Reward;
    }

    function rewardsStaking(uint256 reward, address tokenowner)
        external
        _onlyadmin
    {
        require(
            StakingItems[tokenowner].date > 0,
            "rewardsStaking: This user has not staked items."
        );
        uint256 _amount = StakingItems[tokenowner].amount + reward;
        token.transferFrom(admin, tokenowner, _amount);
        StakingItems[tokenowner] = StakingItem(0, 0);
        emit eStakingReward(tokenowner, _amount, reward);
    }

    //functions created to test the contact.
    function testCreateStaking(
        address tokenowner,
        uint256 amount,
        uint256 timestamp
    ) external _onlyadmin {
        token.transferFrom(tokenowner, admin, amount);
        StakingItems[tokenowner] = StakingItem(amount, timestamp);
        totalSupply += token.balanceOf(admin);
        emit eStakingCreated(admin, amount, block.timestamp);
    }

    //functions created to test the contact.

    modifier _onlyadmin() {
        bool allowed = msg.sender == admin;
        require(allowed == true, "Only admin allowed");
        _;
    }
}
