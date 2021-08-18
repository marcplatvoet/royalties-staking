const { expect } = require("chai");

describe("Staking", async () => {
	let admin, artist, owner1, owner2, tx, accounts;
	const txFee = ethers.utils.parseUnits("1", "ether");
	let token, staking;

	beforeEach(async () => {
		[admin, artist, owner1, owner2] = await ethers.getSigners();
		const Token = await ethers.getContractFactory("MockToken");
		token = await Token.deploy();
		await token.deployed();
		await token.transfer(
			owner1.address,
			ethers.utils.parseUnits("500", "ether")
		);
		await token.transfer(
			owner2.address,
			ethers.utils.parseUnits("500", "ether")
		);
		const Staking = await ethers.getContractFactory("Staking");
		staking = await Staking.deploy(token.address);
		await staking.deployed();

		await staking.addStakingRewards(31, 1000); // 31 days is 10 percent.
		await staking.addStakingRewards(7, 150); // 7 days is 1.5 percent.
		await staking.addStakingRewards(1, 10); // 1 days is 0.1 percent.
		await staking.addStakingRewards(14, 220); // 14 days is 2.2 percent.
	});

	// const getLog = async (accounts) => {
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}
	// };

	it("Check total supply.", async () => {
		try {
			const balance = await staking.totalSupply();

			expect(ethers.utils.formatEther(balance)).to.equal(99000);
		} catch (e) {
			console.log(e.message);
		}
	});

	it("Check percentage needs to be higher then 0.", async () => {
		await expect(staking.addStakingRewards(1, 0)).to.be.revertedWith(
			"addStakingRewards: percentage needs to be higher then 0."
		);
	});

	it("Check stakingdays needs to be higher then 0.", async () => {
		await expect(staking.addStakingRewards(0, 1)).to.be.revertedWith(
			"addStakingRewards: stakingdays needs to be higher then 0."
		);
	});

	it("Check getStakingRewards id is not in array.", async () => {
		await expect(staking.getStakingRewards(10)).to.be.revertedWith(
			"getStakingRewards: id is outside of array. Please try a lower id."
		);
	});

	it("Check stakingBalanceOf owner has not staking ballance.", async () => {
		staking = staking.connect(owner1);
		await expect(staking.stakingBalanceOf()).to.be.revertedWith(
			"stakingBalanceOf: This address has no tokens staked!"
		);
	});

	it("Order in rewards royalties contract 31 days in the end.", async () => {
		const rewardSetting = await staking.getStakingRewards(3);
		expect(rewardSetting.stakingdays).to.equal(31);
		expect(rewardSetting.percentage).to.equal(1000);
	});

	it("Order in rewards royalties contract 7 days in pos 1.", async () => {
		const rewardSetting = await staking.getStakingRewards(1);
		expect(rewardSetting.stakingdays).to.equal(7);
		expect(rewardSetting.percentage).to.equal(150);
	});

	it("Check getStakingByUser owner has no tokens staked.", async () => {
		staking = staking.connect(owner1);
		await expect(staking.getStakingByUser()).to.be.revertedWith(
			"getStakingByUser: This address has no tokens staked!"
		);
	});

	it("Check createStaking The amount you want to stake has to be bigger than zero!", async () => {
		staking = staking.connect(owner1);
		await expect(staking.createStaking(0)).to.be.revertedWith(
			"createStaking: The amount you want to stake has to be bigger than zero!"
		);
	});

	//dificult
	it("Check createStaking: This account has already staked, please get your rewards to stake again!", async () => {
		const stakingAmount = ethers.utils.parseUnits("10", "ether");
		staking = staking.connect(owner1);
		token = token.connect(owner1);
		token.increaseAllowance(owner1.address, stakingAmount);
		await token.increaseAllowance(staking.address, stakingAmount);
		await staking.createStaking(stakingAmount);
		staking.approve;
		const balance = await staking.stakingBalanceOf();
		expect(balance).to.equal(stakingAmount);

		staking = staking.connect(owner1);
		await expect(
			staking.createStaking(ethers.utils.parseUnits("10", "ether"))
		).to.be.revertedWith(
			"createStaking: This account has already staked, please get your rewards to stake again!"
		);
	});

	it("Check calculateReward: This user has not staked items.", async () => {
		staking = staking.connect(owner1);
		await expect(staking.calculateReward()).to.be.revertedWith(
			"calculateReward: This user has not staked items."
		);
	});

	it("Check rewardsStaking: This user has not staked items.", async () => {
		staking = staking.connect(admin);
		await expect(
			staking.rewardsStaking(
				ethers.utils.parseUnits("10", "ether"),
				owner1.address
			)
		).to.be.revertedWith("rewardsStaking: This user has not staked items.");
	});

	it("Check rewardsStaking: Only admin allowed.", async () => {
		staking = staking.connect(owner1);
		await expect(
			staking.rewardsStaking(
				ethers.utils.parseUnits("10", "ether"),
				owner1.address
			)
		).to.be.revertedWith("Only admin allowed");
	});

	it("Check rewardsStaking: This user has not staked items.", async () => {
		staking = staking.connect(owner1);
		await expect(
			staking.testCreateStaking(
				owner1.address,
				ethers.utils.parseUnits("10", "ether"),
				162800000
			)
		).to.be.revertedWith("Only admin allowed");
	});

	//

	it("Add staking owner1 to the contact.", async () => {
		const stakingAmount = ethers.utils.parseUnits("10", "ether");
		staking = staking.connect(owner1);
		token = token.connect(owner1);
		token.increaseAllowance(owner1.address, stakingAmount);
		await token.increaseAllowance(staking.address, stakingAmount);
		await staking.createStaking(stakingAmount);
		staking.approve;
		const balance = await staking.stakingBalanceOf();
		expect(balance).to.equal(stakingAmount);
	});

	it("Add test staking - one day owner1 to the contact.", async () => {
		console.log("Add test staking - one day owner1 to the contact.");
		const stakingAmount = ethers.utils.parseUnits("100", "ether");
		staking = staking.connect(owner1);

		token = token.connect(owner1);
		await token.increaseAllowance(owner1.address, stakingAmount);
		await token.increaseAllowance(staking.address, stakingAmount);

		const timestamp = await staking.getBlockTimestamp();

		let oneday = 86400 * 1; //set amount of days in seconds.
		oneday += 6400; // add a random amount of seconds to be over the set time.
		staking = staking.connect(admin);
		await staking.testCreateStaking(
			owner1.address,
			stakingAmount,
			timestamp - oneday
		);
		staking.approve;
		staking = staking.connect(owner1);

		const balance = await staking.stakingBalanceOf();
		expect(balance).to.equal(stakingAmount);
		const stake = await staking.getStakingByUser();
		// console.log(`amount: ${ethers.utils.formatEther(stake.amount)}`);
		// console.log(`date: ${ethers.utils.formatEther(stake.date)}`);

		// console.log("test one day staking done! time to get the reward...");

		staking = staking.connect(owner1);
		const reward = await staking.calculateReward();
		const amount = await staking.stakingBalanceOf();

		const amountReward = reward.add(amount);
		// console.log(`reward: ${ethers.utils.formatEther(reward)}`);
		// console.log(`amount: ${ethers.utils.formatEther(amount)}`);
		// console.log(`amountReward: ${ethers.utils.formatEther(amountReward)}`);

		token = token.connect(admin);
		await token.increaseAllowance(admin.address, amountReward);
		await token.increaseAllowance(staking.address, amountReward);

		staking = staking.connect(admin);
		const test = await staking.rewardsStaking(reward, owner1.address);
		staking.approve;

		staking = staking.connect(owner1);
		const totamount = await staking.tokenBalanceOf();
		// console.log(`Total amount: ${ethers.utils.formatEther(totamount)}`);
		await expect(staking.stakingBalanceOf()).to.be.revertedWith(
			"stakingBalanceOf: This address has no tokens staked!"
		);
		expect(totamount).to.equal(ethers.utils.parseUnits("500.1", "ether"));
	});

	it("Add test staking - one week owner2 to the contact.", async () => {
		console.log("Add test staking - one week owner2 to the contact.");
		const stakingAmount = ethers.utils.parseUnits("100", "ether");
		staking = staking.connect(owner2);

		token = token.connect(owner2);
		await token.increaseAllowance(owner2.address, stakingAmount);
		await token.increaseAllowance(staking.address, stakingAmount);

		const timestamp = await staking.getBlockTimestamp();

		let sevendays = 86400 * 7; //set amount of days in seconds.
		sevendays += 6400; // add a random amount of seconds to be over the set time.

		staking = staking.connect(admin);
		await staking.testCreateStaking(
			owner2.address,
			stakingAmount,
			timestamp - sevendays
		);
		staking.approve;
		staking = staking.connect(owner2);

		const balance = await staking.stakingBalanceOf();
		expect(balance).to.equal(stakingAmount);
		const stake = await staking.getStakingByUser();
		// console.log(`amount: ${ethers.utils.formatEther(stake.amount)}`);
		// console.log(`date: ${ethers.utils.formatEther(stake.date)}`);

		// console.log("test staking done! time to get the reward...");

		staking = staking.connect(owner2);
		const reward = await staking.calculateReward();
		const amount = await staking.stakingBalanceOf();

		const amountReward = reward.add(amount);
		// console.log(`reward: ${ethers.utils.formatEther(reward)}`);
		// console.log(`amount: ${ethers.utils.formatEther(amount)}`);
		// console.log(`amountReward: ${ethers.utils.formatEther(amountReward)}`);

		token = token.connect(admin);
		await token.increaseAllowance(admin.address, amountReward);
		await token.increaseAllowance(staking.address, amountReward);

		staking = staking.connect(admin);
		const test = await staking.rewardsStaking(reward, owner2.address);
		staking.approve;

		staking = staking.connect(owner2);
		const totamount = await staking.tokenBalanceOf();
		// console.log(`Total amount: ${ethers.utils.formatEther(totamount)}`);
		await expect(staking.stakingBalanceOf()).to.be.revertedWith(
			"stakingBalanceOf: This address has no tokens staked!"
		);
		expect(totamount).to.equal(ethers.utils.parseUnits("501.5", "ether"));
	});

	it("Add test staking - one month owner2 to the contact.", async () => {
		console.log("Add test staking - one month owner2 to the contact.");
		const stakingAmount = ethers.utils.parseUnits("100", "ether");
		staking = staking.connect(owner2);

		token = token.connect(owner2);
		await token.increaseAllowance(owner2.address, stakingAmount);
		await token.increaseAllowance(staking.address, stakingAmount);

		const timestamp = await staking.getBlockTimestamp();
		let onemonth = 86400 * 31; //set amount of days in seconds.
		onemonth += 6400; // add a random amount of seconds to be over the set time.
		staking = staking.connect(admin);
		await staking.testCreateStaking(
			owner2.address,
			stakingAmount,
			timestamp - onemonth
		);
		staking.approve;
		staking = staking.connect(owner2);

		const balance = await staking.stakingBalanceOf();
		expect(balance).to.equal(stakingAmount);
		const stake = await staking.getStakingByUser();
		// console.log(`amount: ${ethers.utils.formatEther(stake.amount)}`);
		// console.log(`date: ${ethers.utils.formatEther(stake.date)}`);

		// console.log("test one month staking done! time to get the reward...");

		staking = staking.connect(owner2);
		const reward = await staking.calculateReward();
		const amount = await staking.stakingBalanceOf();

		const amountReward = reward.add(amount);
		// console.log(`reward: ${ethers.utils.formatEther(reward)}`);
		// console.log(`amount: ${ethers.utils.formatEther(amount)}`);
		// console.log(`amountReward: ${ethers.utils.formatEther(amountReward)}`);

		token = token.connect(admin);
		await token.increaseAllowance(admin.address, amountReward);
		await token.increaseAllowance(staking.address, amountReward);

		staking = staking.connect(admin);
		const test = await staking.rewardsStaking(reward, owner2.address);
		staking.approve;

		staking = staking.connect(owner2);
		const totamount = await staking.tokenBalanceOf();
		// console.log(`Total amount: ${ethers.utils.formatEther(totamount)}`);

		await expect(staking.stakingBalanceOf()).to.be.revertedWith(
			"stakingBalanceOf: This address has no tokens staked!"
		);

		expect(totamount).to.equal(ethers.utils.parseUnits("510", "ether"));
	});
});
