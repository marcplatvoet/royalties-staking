import "./App.css";
import { React, useEffect, useState } from "react";
import LoginButton from "./components/loginbutton";
import Header from "./header";
import { Navbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { getTokenBlockchain } from "./components/token";
import Mint from "./pages/mint";
import Artist from "./pages/artist";
import About from "./pages/about";
import TransferTokens from "./pages/transfertokens";
import { Row, Col } from "react-bootstrap";

function App() {
	//const [message, setMessage] = useState(false);
	const [currentAccount, setCurrentAccount] = useState("");
	const [currentChainID, setCurrentChainID] = useState(0);
	const [signerAddress, setSignerAddress] = useState("");
	const [mytoken, setMyToken] = useState("");
	const [messages, addMessage] = useState([]);
	const [page, setPage] = useState("");

	const Connected = (currentAccount, currentchainid) => {
		setCurrentAccount(currentAccount);
		setCurrentChainID(currentChainID);
	};

	const setThePage = (page) => {
		console.log(page);
		setPage(page);
	};

	useEffect(() => {
		const init = async () => {
			try {
				const { signerAddress, mytoken } = await getTokenBlockchain();
				setMyToken(mytoken);
				setSignerAddress(signerAddress);
			} catch (e) {
				console.log(e);
			}
		};
		init();
	}, []);

	return (
		<>
			<Navbar bg="dark" className="justify-content-between" variant="dark">
				<Header setThePage={setThePage} />
				<LoginButton Connected={Connected} />
			</Navbar>
			<Container>
				<Row>
					<Col>
						{page === "about" ? <About /> : null}
						{page === "mint" ? (
							<Mint
								signerAddress={signerAddress}
								mytoken={mytoken}
								currentAccount={currentAccount}
								addMessage={addMessage}
							/>
						) : null}
						{page === "transfertokens" ? (
							<TransferTokens
								signerAddress={signerAddress}
								mytoken={mytoken}
								currentAccount={currentAccount}
								addMessage={addMessage}
							/>
						) : null}
						{page === "artist" ? (
							<Artist
								signerAddress={signerAddress}
								mytoken={mytoken}
								currentAccount={currentAccount}
								addMessage={addMessage}
							/>
						) : null}
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default App;
