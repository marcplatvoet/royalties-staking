import { ethers, Contract } from "ethers";
//import { React, useState } from "react";
//import Web3 from "web3";
import MyToken from "../contracts/MyToken.json";

const getBalance = async (token, account) => {
	const balance = await token.balanceOf(account);
	return ethers.utils.formatEther(balance);
};

const getTokenBlockchain = () =>
	new Promise((resolve, reject) => {
		window.addEventListener("load", async () => {
			console.log(`window.ethereum: ${window.ethereum}`);
			if (window.ethereum) {
				await window.ethereum.enable();
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				// console.log(`provider: ${provider}`);
				const signer = provider.getSigner();
				// console.log(`signer:${signer}`);
				const signerAddress = await signer.getAddress();
				// console.log(`signerAddress:${signerAddress}`);
				const mytoken = new Contract(MyToken.address, MyToken.abi, signer);
				//const balance = getBalance(mytoken, signerAddress);
				const balance = await mytoken.balanceOf(signerAddress);
				//console.log(balance);
				console.log(ethers.utils.formatEther(balance));

				let artist = await mytoken._artist();

				const percentage = ethers.utils.formatEther(
					await mytoken._percentage()
				);

				const admin = await mytoken.admin();

				if (artist === "0x0000000000000000000000000000000000000000") {
					artist = null;
				}

				console.log(artist);
				console.log(percentage);
				console.log(admin);

				resolve({
					signerAddress,
					mytoken,
					addresses: [artist, percentage, admin],
				});
			}
			resolve({
				signerAddress: undefined,
				mytoken: undefined,
				addresses: [],
			});
		});
	});

export { getTokenBlockchain, getBalance };
