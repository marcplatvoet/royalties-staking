import logo from './logo.svg'
//import bnb from './assets/bnb.png'
import ChainLogo from './assets/ChainLogos'
import './App.css'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState } from 'react'
import { Navbar,Container,Row,Col,Button,Alert,OverlayTrigger,Tooltip  } from 'react-bootstrap'

function App() {

  const [currentAccount, setCurrentAccount] = useState('')
  const [isLogged, setIsLogged] = useState(false)
  const [currentChainID, setCurrentChainID] = useState(-1)

  const SignIn = async () => {
      //Detect Provider
      const provider = await detectEthereumProvider()
      const web3 = new Web3(provider)

      if(!provider) {

        setMessage(messages => [...messages, {head : "Wallet not found", body: `Please install MetaMask!`, variant: 'warning'}])

      } else {

        const address = await ConnectWallet()
        if (address)
          setMessage(messages =>[...messages, {head : "User Login", body: `addres: ${address}`, variant: 'success'}])

      }
      
  }

  const ConnectWallet = async () => {

    console.log("Try Connect");

    try {
      await window.ethereum.enable();

      const id = await window.ethereum.request({ method: 'eth_chainId' })
      setCurrentChainID(() => parseInt(id, 16))

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setIsLogged(true)
      setCurrentAccount(accounts[0])
      return accounts[0]

    } catch(err) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.')
          setMessage(messages =>[...messages, {head : "User Rejected Request", body: 'Please connect to MetaMask.', variant: 'info'}])

        } else if(err.code === -32002) {
          console.log('Please unlock MetaMask.')
          setMessage(messages =>[...messages, {head : "User Request Pending", body: 'Please unlock MetaMask and try agin.', variant: 'info'}])
        } else {
          console.error(err);
          setMessage(messages =>[...messages, {head : "Error", body: err.message, variant: 'info'}])
        }

    }
    
  }

  const handleAccountsChanged = (accounts) => {

    console.log('handleAccountsChanged');

    //if(!isLogged) return

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setMessage(messages => [...messages, {head : "User Rejected Request", body: 'Please connect to MetaMask.', variant: 'info'}])
    } else if (accounts[0] !== currentAccount) {
      console.log(accounts[0])
      console.log(messages);
      setCurrentAccount(() => accounts[0])
      setMessage(messages => [...messages, {head : "Account Changed", body: `addres: ${accounts[0]}`, variant: 'warning'}])
    }
  }

  useEffect(() => {
    

    window.onbeforeunload = function() { return "Prevent reload" }
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    window.ethereum.on('chainChanged', (_chainId) => {
      console.log(_chainId);
      setCurrentChainID(() => parseInt(_chainId, 16))
      //window.location.reload()
    });


  }, []);



  const SignOut = async () => {
    setIsLogged(false)
    setCurrentAccount('')
  }

  const shortAddr = () => {
    return `${currentAccount.substr(0,4)}...${currentAccount.substring(currentAccount.length - 4, currentAccount.length)}`
  }


  
  const [messages, setMessage] = useState([
  
  ])
  
  const Message = (props) => {

    const [show, setShow] = useState(true);

    const close = () => {
      setShow(false)
      setMessage(messages.filter((item, index) => index !== props.id))
    }

    if(show) {
      return (
        <Alert variant={props.variant ? props.variant : 'dark'} onClose={close} dismissible>
          <Alert.Heading>{props.head}</Alert.Heading>
          <p>
            {props.body}
          </p>
        </Alert>
      )
    } else {
      return(<></>)
    }

    
  }

  const Chain = (props) => {

    const chainId = props.chainId

    let chainLogo
    let variant
    let chainName

    switch (chainId) {
      case 1: //ETH
          chainLogo = ChainLogo.eth
          variant = "light"
          chainName = "Ethereum Network"
        break;
      case 56: //BNB
          chainLogo = ChainLogo.bnb
          variant = "secondary"
          chainName = "Binance Smart Chain"
        break;
      case 128: //HT
          chainLogo = ChainLogo.ht
          variant = "light"
          chainName = "Heco"
        break;
      case 100: //xDai
          chainLogo = ChainLogo.xdai
          variant = "light"  
          chainName = "xDai Stable Chain"
        break;
      case 137: //Polygon
          chainLogo = ChainLogo.polygon
          variant = "light"
          chainName = "Polygon Network"
        break;
      default: // Unknown network
          chainLogo = ChainLogo.unknown
          variant = "light"
          chainName = "Unknown network?"
        break;
    }

    return(
      <OverlayTrigger
        key="left"
        placement="left"
        overlay={
          <Tooltip id={`tooltip-left`}>
            {chainName}
        </Tooltip>
        }
      >
        <Button variant={variant} >
          <img src={chainLogo} width={14} alt={chainName} />
        </Button>
      </OverlayTrigger>
    )
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
      />{' '}
      0x React Bootstrap Tutorial
      
    </Navbar.Brand>
    <div>
      <Chain chainId={currentChainID} />{' '}
      <Button className="connect-button" disabled={isLogged} onClick={SignIn} variant="primary">{isLogged ? shortAddr() : "Connect"}</Button>{' '}
      <Button onClick={SignOut} style={{visibility: isLogged ? "visible" : "hidden"}} variant="danger">X</Button>
    </div>
  </Navbar>

    <div className="message-list" >
        {
          messages.map((item,i) => (
            <Message head={item.head} body={item.body} variant={item.variant} id={i} key={i} />
          ))
        }
    </div>

    <Container>
      <Row>
        <Col>
        
        <img src={logo} className="App-logo" alt="logo" />

        
        </Col>
      </Row>
    </Container>
  </>
  );
}

export default App;
