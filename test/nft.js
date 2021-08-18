const { expect } = require("chai");

describe("NFT", async () => {
	let admin, artist, owner1, owner2, tx, accounts;
	const txFee = ethers.utils.parseUnits("1", "ether");
	let token, nft;

	beforeEach(async () => {
		accounts = await ethers.getSigners();
		for (var i = 0; i < 8; i++) {
			accounts[i]["name"] = `owner${i - 1}`;
			if (i == 0) accounts[i]["name"] = `admin`;
			if (i == 1) accounts[i]["name"] = `artist`;
		}
		// accounts.map((account) =>
		// 	console.log(`account:${account.name} address: ${account.address}`)
		// );
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
		const NFT = await ethers.getContractFactory("NFT");
		nft = await NFT.deploy(artist.address, token.address, txFee);
		await nft.deployed();
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

	// it("Should transfer NFT and pay royalties", async () => {
	// 	let ownerNFT, balanceSender, balanceArtist;
	// 	console.log("Should transfer NFT and pay royalties");
	// 	console.log("before any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}

	// 	nft = nft.connect(artist);
	// 	await nft.transferFrom(artist.address, owner1.address, 0);
	// 	ownerNFT = await nft.ownerOf(0);
	// 	expect(ownerNFT).to.equal(owner1.address);

	// 	await token.connect(owner1).approve(nft.address, txFee);
	// 	await nft.connect(owner1).transferFrom(owner1.address, owner2.address, 0);
	// 	ownerNFT = await nft.ownerOf(0);
	// 	balanceSender = await token.balanceOf(owner1.address);
	// 	balanceArtist = await token.balanceOf(artist.address);
	// 	expect(ownerNFT).to.equal(owner2.address);
	// 	expect(balanceSender.toString()).to.equal(
	// 		ethers.utils.parseUnits("499", "ether")
	// 	);
	// 	expect(balanceArtist.toString()).to.equal(
	// 		ethers.utils.parseUnits("1", "ether")
	// 	);

	// 	console.log("after any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}
	// });

	// it("Should not pay royalties if in excludedList", async () => {
	// 	let balanceSender, balanceArtist;
	// 	console.log("Should not pay royalties if in excludedList");
	// 	console.log("before any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}

	// 	nft = nft.connect(artist);
	// 	await nft.transferFrom(artist.address, owner1.address, 0);
	// 	balanceArtist = await token.balanceOf(artist.address);
	// 	expect(balanceArtist).to.equal(0);

	// 	console.log("artist transfers!");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}

	// 	await nft.setExcluded(owner1.address, true);
	// 	nft = nft.connect(owner1);
	// 	await nft.transferFrom(owner1.address, owner2.address, 0);
	// 	balanceSender = await token.balanceOf(owner1.address);
	// 	balanceArtist = await token.balanceOf(artist.address);

	// 	console.log("owner1 to owner2 transfers!");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}

	// 	expect(balanceSender).to.equal(ethers.utils.parseUnits("500", "ether"));
	// 	expect(balanceArtist).to.equal(0);

	// 	console.log("after any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}
	// });

	// it("Should not transfer NFT if not enough token for royalties", async () => {
	// 	console.log("Should not transfer NFT if not enough token for royalties");
	// 	console.log("before any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}

	// 	nft = nft.connect(artist);
	// 	await nft.transferFrom(artist.address, owner1.address, 0);
	// 	token = token.connect(owner1);
	// 	await token.transfer(owner2.address, ethers.utils.parseUnits("500"));
	// 	await token.approve(nft.address, txFee);
	// 	nft = nft.connect(owner1);

	// 	await expect(
	// 		nft.transferFrom(owner1.address, owner2.address, 0)
	// 	).to.be.revertedWith("ERC20: transfer amount exceeds balance");

	// 	console.log("after any transaction");
	// 	for (var i = 0; i < accounts.length; i++) {
	// 		console.log(
	// 			`balance ${accounts[i].name}: ${await token.balanceOf(
	// 				accounts[i].address
	// 			)} excluded: ${await nft.excludedList(accounts[i].address)}`
	// 		);
	// 	}
	// });

	// it("Should add/remove from excludedList", async () => {
	// 	nft = nft.connect(artist);
	// 	await nft.setExcluded(owner1.address, true);
	// 	expect(await nft.excludedList(owner1.address)).to.equal(true);
	// 	await nft.setExcluded(owner1.address, false);
	// 	expect(await nft.excludedList(owner1.address)).to.equal(false);

	// 	nft = nft.connect(owner2);
	// 	await expect(nft.setExcluded(owner2.address, true)).to.be.revertedWith(
	// 		"artist only"
	// 	);
	// });

	it("test", async () => {
		console.log("test");
		console.log("before any transaction");
		for (var i = 0; i < 8; i++) {
			console.log(
				`balance ${accounts[i].name}: ${await token.balanceOf(
					accounts[i].address
				)} excluded: ${await nft.excludedList(accounts[i].address)}`
			);
		}

		nft = nft.connect(artist);
		await nft.transferFrom(artist.address, owner1.address, 0);
		token = token.connect(owner1);
		await token.transfer(accounts[5].address, ethers.utils.parseUnits("50"));
		await token.approve(nft.address, txFee);
		nft = nft.connect(owner1);
		await nft.transferFrom(owner1.address, accounts[5].address, 0);
		nft.approve;

		token = token.connect(owner2);
		await token.transfer(accounts[6].address, ethers.utils.parseUnits("50"));
		token = token.connect(owner1);
		await token.approve(nft.address, txFee);
		nft = nft.connect(owner1);
		await nft.transferFrom(owner2.address, accounts[6].address, 0);

		expect(token.balanceOf(artist.address)).to.equal(2);

		console.log("after any transaction");
		for (var i = 0; i < 8; i++) {
			console.log(
				`balance ${accounts[i].name}: ${await token.balanceOf(
					accounts[i].address
				)} excluded: ${await nft.excludedList(accounts[i].address)}`
			);
		}
	});
});
