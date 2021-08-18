import { React, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Button } from "react-bootstrap";
import Message from "./message";

const LoginButton = ({ Connected }) => {
	const [messages, setMessage] = useState([]);
	const [isLogged, setIsLogged] = useState(false);
	const [currentAccount, setCurrentAccount] = useState("");
	const [currentchainid, setCurrentChainID] = useState(0);

	const SignIn = async () => {
		//Detect Provider
		const provider = await detectEthereumProvider();
		if (!provider) {
			setMessage((messages) => [
				...messages,
				{
					head: "Wallet not found",
					body: `Please install MetaMask!`,
					variant: "warning",
				},
			]);
		} else {
			const address = await ConnectWallet();
			if (address)
				setMessage((messages) => [
					...messages,
					{
						head: "User Login",
						body: `addres: ${address}`,
						variant: "success",
					},
				]);
		}
	};

	const ConnectWallet = async () => {
		//console.log("Try Connect");

		try {
			await window.ethereum.enable();

			const id = await window.ethereum.request({ method: "eth_chainId" });
			setCurrentChainID(() => parseInt(id, 16));

			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setIsLogged(true);
			setCurrentAccount(accounts[0]);
			//console.log(accounts);
			Connected(currentAccount, currentchainid);
			return currentAccount;
		} catch (err) {
			if (err.code === 4001) {
				// EIP-1193 userRejectedRequest error
				// If this happens, the user rejected the connection request.
				console.log("Please connect to MetaMask.");
				setMessage((messages) => [
					...messages,
					{
						head: "User Rejected Request",
						body: "Please connect to MetaMask.",
						variant: "info",
					},
				]);
			} else if (err.code === -32002) {
				console.log("Please unlock MetaMask.");
				setMessage((messages) => [
					...messages,
					{
						head: "User Request Pending",
						body: "Please unlock MetaMask and try agin.",
						variant: "info",
					},
				]);
			} else {
				console.error(err);
				setMessage((messages) => [
					...messages,
					{ head: "Error", body: err.message, variant: "info" },
				]);
			}
		}
	};

	const SignOut = async () => {
		setIsLogged(false);
		setCurrentAccount("");
	};

	const shortAddr = () => {
		return `${currentAccount.substr(0, 4)}...${currentAccount.substring(
			currentAccount.length - 4,
			currentAccount.length
		)}`;
	};

	return (
		<div>
			<Button
				className={isLogged ? "connect-button btn-primary" : "btn-success"}
				onClick={isLogged ? SignOut : SignIn}
				variant="primary"
			>
				{isLogged ? shortAddr(currentAccount) : "Connect"}
			</Button>{" "}
			<div className="message-list">
				{messages.map((item, i) => (
					<Message
						head={item.head}
						body={item.body}
						variant={item.variant}
						id={i}
						key={i}
					/>
				))}
			</div>
		</div>
	);
};

export default LoginButton;
