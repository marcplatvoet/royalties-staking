import logo from "./logo.svg";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { React, useEffect, useState } from "react";
import { Navbar, Container, Row, Col, Button, Alert } from "react-bootstrap";
import Chain from "./components/chain";
import About from "./pages/about";
import Mint from "./pages/mint";
import Artist from "./pages/artist";
import TransferTokens from "./pages/transfertokens";
import { getTokenBlockchain } from "./components/token";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [currentChainID, setCurrentChainID] = useState(-1);
  const [page, setPage] = useState("");
  const [mytoken, setMyToken] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

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

  const SignIn = async () => {
    //Detect Provider
    const provider = await detectEthereumProvider();
    //const web3 = new Web3(provider)

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
    console.log("Try Connect");

    try {
      await window.ethereum.enable();

      const id = await window.ethereum.request({ method: "eth_chainId" });
      setCurrentChainID(() => parseInt(id, 16));

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsLogged(true);
      setCurrentAccount(accounts[0]);

      console.log(accounts);
      return accounts[0];
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

  useEffect(() => {
    window.onbeforeunload = function () {
      return "Prevent reload";
    };
    window.ethereum.on(
      "accountsChanged",
      function (accounts, currentAccount, messages) {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          setMessage((messages) => [
            ...messages,
            {
              head: "User Rejected Request",
              body: "Please connect to MetaMask.",
              variant: "info",
            },
          ]);
        } else if (accounts[0] !== currentAccount) {
          console.log(accounts[0]);
          console.log(messages);
          setCurrentAccount(() => accounts[0]);
          setMessage((messages) => [
            ...messages,
            {
              head: "Account Changed",
              body: `addres: ${accounts[0]}`,
              variant: "warning",
            },
          ]);
        }
      }
    );

    window.ethereum.on("chainChanged", (_chainId) => {
      console.log(_chainId);
      setCurrentChainID(() => parseInt(_chainId, 16));
      //window.location.reload()
    });
  }, []);

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

  const [messages, setMessage] = useState([]);

  const addMessage = (item) => {
    setMessage(item);
  };

  const Message = (props) => {
    const [show, setShow] = useState(true);

    const close = () => {
      setShow(false);
      setMessage(messages.filter((item, index) => index !== props.id));
    };

    if (show) {
      return (
        <Alert
          variant={props.variant ? props.variant : "dark"}
          onClose={close}
          dismissible
        >
          <Alert.Heading>{props.head}</Alert.Heading>
          <p>{props.body}</p>
        </Alert>
      );
    } else {
      return <></>;
    }
  };

  function onLinkClick(navpage) {
    console.log(navpage);
    setPage(navpage);
  }

  if (typeof mytoken === "undefined") {
    return "Loading...";
  }

  return (
    <>
      <Navbar bg="dark" className="justify-content-between" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top App-logo"
          />{" "}
          <button
            bg="dark"
            className="btn btn-dark"
            onClick={() => onLinkClick("about")}
            variant="dark"
          >
            About
          </button>
          <button
            bg="dark"
            className="btn btn-dark"
            onClick={() => onLinkClick("transfertokens")}
            variant="dark"
          >
            Transfer Tokens
          </button>
          <button
            bg="dark"
            className="btn btn-dark"
            onClick={() => onLinkClick("mint")}
            variant="dark"
          >
            Mint Tokens
          </button>
          <button
            bg="dark"
            className="btn btn-dark"
            onClick={() => onLinkClick("artist")}
            variant="dark"
          >
            Artist
          </button>
        </Navbar.Brand>
        <div>
          <Chain chainId={currentChainID} />{" "}
          <Button
            className={isLogged ? "connect-button btn-primary" : "btn-success"}
            onClick={isLogged ? SignOut : SignIn}
            variant="primary"
          >
            {isLogged ? shortAddr() : "Connect"}
          </Button>{" "}
        </div>
      </Navbar>

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
