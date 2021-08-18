const fs = require("fs");

async function main() {
	const txFee = ethers.utils.parseUnits("1", "ether");
	const [admin, artist, owner1, owner2] = await ethers.getSigners();
	console.log(`Deploying contracts with the account admin: ${admin.address}`);
	console.log(`Deploying contracts with the account artist: ${artist.address}`);
	console.log(`Deploying contracts with the ether: ${txFee}`);

	console.log(`deploying the Token!`);
	const balance = await admin.getBalance();
	console.log(`Account balance: ${balance.toString()}`);

	const Token = await ethers.getContractFactory("MyToken");
	const token = await Token.deploy();
	console.log(`Token address: ${token.address}`);

	const data = {
		address: token.address,
		abi: JSON.parse(token.interface.format("json")),
	};
	fs.writeFileSync(
		"./frontend/src/contracts/MyToken.json",
		JSON.stringify(data)
	);

	// const addressdata = {
	// 	token: token.address,
	// 	nfttoken: tokenNFT.address,
	// 	admin: admin.address,
	// 	artist: artist.address,
	// };
	// fs.writeFileSync(
	// 	"./frontend/src/contracts/addresses.json",
	// 	JSON.stringify(addressdata)
	// );
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
