const fs = require("fs");

async function main() {
	const txFee = ethers.utils.parseUnits("100000", "ether");
	const [admin, artist, owner1, owner2] = await ethers.getSigners();
	console.log(`Deploying contracts with the account admin: ${admin.address}`);
	console.log(`Deploying contracts with the account artist: ${artist.address}`);
	console.log(`Deploying contracts with the ether: ${txFee}`);

	console.log(`deploying the MockToken!`);
	const balance = await admin.getBalance();
	console.log(`Account balance: ${balance.toString()}`);

	const Token = await ethers.getContractFactory("MockToken");
	const token = await Token.deploy();
	console.log(`Token address: ${token.address}`);

	console.log(`deploying the NFT!`);
	console.log(`Account balance: ${balance.toString()}`);

	const TokenStaking = await ethers.getContractFactory("Staking");
	const tokenstaking = await TokenStaking.deploy(token.address);
	console.log(`Token staking address: ${tokenstaking.address}`);

	const dataStaking = {
		address: tokenstaking.address,
		abi: JSON.parse(tokenstaking.interface.format("json")),
	};
	fs.writeFileSync(
		"./frontend/src/contracts/Staking.json",
		JSON.stringify(dataStaking)
	);

	const data = {
		address: token.address,
		abi: JSON.parse(token.interface.format("json")),
	};
	fs.writeFileSync(
		"./frontend/src/contracts/MockToken.json",
		JSON.stringify(data)
	);

	const addressdata = {
		token: token.address,
		stakingtoken: tokenstaking.address,
		admin: admin.address,
	};
	fs.writeFileSync(
		"./frontend/src/contracts/addresses.json",
		JSON.stringify(addressdata)
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
