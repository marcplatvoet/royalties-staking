import detectEthereumProvider from "@metamask/detect-provider";

const ConnectWallet = () =>
  new Promise(async (resolve, reject) => {
    let messages = [];
    console.log("Try Connect");

    try {
      await window.ethereum.enable();

      const chainid = await window.ethereum.request({ method: "eth_chainId" });
      //setCurrentChainID(() => parseInt(id, 16))

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // setIsLogged(true)
      // setCurrentAccount(accounts[0])

      resolve(messages, parseInt(chainid, 16), true, accounts);
      return;
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
        messages = [
          ...messages,
          {
            head: "User Rejected Request",
            body: "Please connect to MetaMask.",
            variant: "info",
          },
        ];
      } else if (err.code === -32002) {
        console.log("Please unlock MetaMask.");
        messages = [
          ...messages,
          {
            head: "User Request Pending",
            body: "Please unlock MetaMask and try agin.",
            variant: "info",
          },
        ];
      } else {
        console.error(err);
        messages = [
          ...messages,
          { head: "Error", body: err.message, variant: "info" },
        ];
      }
      reject(messages, 0, false, undefined);
    }
  });

const SignIn = () =>
  new Promise(async (resolve, reject) => {
    let messages = [];
    let chainid = undefined;
    let loggedin = false;
    //Detect Provider
    const provider = await detectEthereumProvider();
    //const web3 = new Web3(provider)
    if (!provider) {
      messages = [
        ...messages,
        {
          head: "Wallet not found",
          body: `Please install MetaMask!`,
          variant: "warning",
        },
      ];
      reject({ messages, provider });
      return;
    } else {
      const { messages, chainid, loggedin, accounts } = await ConnectWallet();
      const address = accounts[0];
      if (address) {
        messages = [
          ...messages,
          {
            head: "User Login",
            body: `addres: ${address}`,
            variant: "success",
          },
        ];
      }
      resolve({ messages, provider, address });
      return;
    }
  });

export default SignIn;
