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

		await staking.addStakingRewards(31, 400); // 31 days is 4 percent.
		await staking.addStakingRewards(7, 250); // 7 days is 2.5 percent.
		await staking.addStakingRewards(1, 100); // 1 days is 1 percent.
		await staking.addStakingRewards(14, 300); // 14 days is 3 percent.
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

	it("Order in rewards royalties contract 31 days in the end.", async () => {
		try {
			expect(staking.getStakingRewards(3)).to.equal([31, 400]);
		} catch (e) {
			console.log(e.message);
		}
	});
	it("Order in rewards royalties contract 7 days in pos 1.", async () => {
		try {
			expect(staking.getStakingRewards(1)).to.equal([7, 250]);
		} catch (e) {
			console.log(e.message);
		}
	});

	it("Add staking owner1 to the contact.", async () => {
		try {
			const stakingAmount = ethers.utils.parseUnits("10", "ether");
			staking = staking.connect(owner1);
			token = token.connect(owner1);
			token.increaseAllowance(owner1.address, stakingAmount);
			await token.increaseAllowance(staking.address, stakingAmount);
			await staking.createStaking(stakingAmount);
			staking.approve;
			const balance = await staking.stakingBalanceOf();
			expect(balance).to.equal(stakingAmount);
		} catch (e) {
			console.log(e.message);
		}
	});

	it("Add test staking - one week owner2 to the contact.", async () => {
		try {
			const stakingAmount = ethers.utils.parseUnits("100", "ether");
			staking = staking.connect(owner2);

			token = token.connect(owner2);
			await token.increaseAllowance(owner2.address, stakingAmount);
			await token.increaseAllowance(staking.address, stakingAmount);

			const timestamp = await staking.getBlockTimestamp();
			let sevendays = 86400 * 7;
			sevendays += 6400;
			await staking.testCreateStaking(stakingAmount, timestamp - sevendays);
			staking.approve;

			const balance = await staking.stakingBalanceOf();
			expect(balance).to.equal(stakingAmount);
			const stake = await staking.getStakingByUser();
			console.log(`amount: ${ethers.utils.formatEther(stake.amount)}`);
			console.log(`date: ${ethers.utils.formatEther(stake.date)}`);

			console.log("test staking done! time to get the reward...");

			staking = staking.connect(owner2);
			const reward = await staking.calculateReward();
			const amount = await staking.stakingBalanceOf();

			const amountReward = reward.add(amount);
			console.log(`reward: ${ethers.utils.formatEther(reward)}`);
			console.log(`amount: ${ethers.utils.formatEther(amount)}`);
			console.log(`amountReward: ${ethers.utils.formatEther(amountReward)}`);

			token = token.connect(admin);
			await token.increaseAllowance(admin.address, amountReward);
			await token.increaseAllowance(staking.address, amountReward);

			staking = staking.connect(admin);
			const test = await staking.rewardsStaking(reward, owner2.address);
			staking.approve;

			staking = staking.connect(owner2);
			const totamount = await staking.tokenBalanceOf();
			console.log(`Total amount: ${ethers.utils.formatEther(totamount)}`);
			const amountAfter = await staking.stakingBalanceOf();
			console.log(
				`amount after staking: ${ethers.utils.formatEther(amountAfter)}`
			);
		} catch (e) {
			console.log(e.message);
		}
	});

	it("Should transfer NFT and pay royalties", async () => {
		try {
			console.log("Start test");

			balanceAdmin = await token.balanceOf(admin.address);
			balanceOwner1 = await token.balanceOf(owner1.address);

			console.log("Before");
			// balanceAdmin = await token.balanceOf(admin.address);
			// balanceArtist = await token.balanceOf(artist.address);
			// balanceOwner1 = await token.balanceOf(owner1.address);
			// balanceOwner2 = await token.balanceOf(owner2.address);

			// console.log(`admin: ${ethers.utils.formatEther(balanceAdmin)}`);
			// console.log(`artist ${ethers.utils.formatEther(balanceArtist)}`);
			// console.log(`owner1 ${ethers.utils.formatEther(balanceOwner1)}`);
			// console.log(`owner2 ${ethers.utils.formatEther(balanceOwner2)}`);

			staking = staking.connect(owner1);
			// token = token.connect(admin);
			// await token.transfer(
			// 	owner2.address,
			// 	ethers.utils.parseUnits("500", "ether")
			// );

			token = token.connect(owner2);
			token.increaseAllowance(
				owner2.address,
				ethers.utils.parseUnits("500", "ether")
			);
			// await token.transferFrom(
			// 	owner2.address,
			// 	owner1.address,
			// 	ethers.utils.parseUnits("500", "ether")
			// );
			// token.approve;

			staking = staking.connect(owner2);

			const ballance = await staking.tokenBalanceOf();
			console.log(ethers.utils.formatEther(ballance));
			console.log(await staking.admin());

			await token.increaseAllowance(
				staking.address,
				ethers.utils.parseUnits("100", "ether")
			);
			await staking.createStaking(ethers.utils.parseUnits("10", "ether"));
			staking.approve;

			const stakingballance = await staking.balanceOf();
			console.log(
				`stakingballance: ${ethers.utils.formatEther(stakingballance)}`
			);
			const totalSupply = await staking.totalSupply();
			console.log(`totalSupply: ${ethers.utils.formatEther(totalSupply)}`);

			// await token.allowance(owner1.address, staking.address);
			// await token.increaseAllowance(
			// 	staking.address,
			// 	ethers.utils.parseUnits("100", "ether")
			// );
			// await token.approve(
			// 	owner1.address,
			// 	ethers.utils.parseUnits("10", "ether")
			// );

			// await token.transferFrom(
			// 	owner1.address,
			// 	admin.address,
			// 	ethers.utils.parseUnits("10", "ether")
			// );

			console.log("After");
			// balanceAdmin = await token.balanceOf(admin.address);
			// balanceArtist = await token.balanceOf(artist.address);
			// balanceOwner1 = await token.balanceOf(owner1.address);
			// balanceOwner2 = await token.balanceOf(owner2.address);

			// console.log(`admin: ${ethers.utils.formatEther(balanceAdmin)}`);
			// console.log(`artist ${ethers.utils.formatEther(balanceArtist)}`);
			// console.log(`owner1 ${ethers.utils.formatEther(balanceOwner1)}`);
			// console.log(`owner2 ${ethers.utils.formatEther(balanceOwner2)}`);

			// 	let ownerNFT, balanceSender, balanceArtist;
			// expect(staking.balanceOf()).to.equal(
			// 	ethers.utils.parseUnits("10", "ether")
			// );
			// console.log("Should transfer NFT and pay royalties");
			// console.log("before any transaction");
			// 	for (var i = 0; i < accounts.length; i++) {
			// 		console.log(
			// 			`balance ${accounts[i].name}: ${await token.balanceOf(
			// 				accounts[i].address
			// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
			// 		);
		} catch (e) {
			console.log(e.message);
		}
	});
});
