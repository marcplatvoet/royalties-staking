// Import the ethers library
import { React, useState } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import MyToken from "../contracts/MyToken.json";

const Mint = ({ signerAddress, mytoken, currentAccount, addMessage }) => {
  const [balancefrom, setBalanceFrom] = useState(0);
  const [balanceto, setBalanceTo] = useState(0);
  const [balanceartist, setBalanceArtist] = useState(0);

  const onMint = async (e) => {
    try {
      e.preventDefault();
      const amount = e.target.elements.amount.value;
      await mytoken.mint(ethers.utils.parseUnits(amount));
    } catch (oE) {
      const message = [
        {
          head: "Error!",
          body: oE.message,
          variant: "error",
        },
      ];
      addMessage(message);
    }
  };

  const getBalances = async (from, to) => {
    setBalanceFrom(await mytoken.balanceOf(from));
    setBalanceTo(await mytoken.balanceOf(to));

    const artist = await mytoken._artist();
    if (artist !== "0x0000000000000000000000000000000000000000") {
      setBalanceArtist(await mytoken.balanceOf(artist));
    }

    const message = [
      {
        head: "transfer complete.",
        body: "The transfer of the tokens is complete!",
        variant: "info",
      },
    ];
    addMessage(message);
  };

  mytoken.on("Transfer", (from, to, amount) => {
    getBalances(from, to);
  });

  return (
    <div>
      <h1>Transfer tokens without royalties</h1>
      <br />

      <div className="card col-sm-8 bg-secondary">
        The token address: {MyToken.address} is the token that we can transfer
        with or without royalties to the artist. The artist can be setup by the
        admin, and the percentage of royalties that the artist receives with
        every transaction.
      </div>
      <br />
      <div>{`Balance sender: ${ethers.utils.formatEther(balancefrom)}`} </div>
      <div>{`Balance receiver: ${ethers.utils.formatEther(balanceto)}`} </div>
      <div>{`Balance artist: ${ethers.utils.formatEther(balanceartist)}`}</div>
      <br />

      <div className="row">
        <div className="col-lg-6  card col-sm-8 bg-secondary">
          <div className="card-body">
            <div className="card-header">
              Get tokens to your account for testing.
            </div>
            <form onSubmit={(e) => onMint(e)}>
              To address:
              <input
                type="readonly"
                name="to"
                className="form-control"
                placeholder=""
                value={currentAccount}
              />
              Amount:
              <input
                type="readonly"
                name="amount"
                className="form-control"
                placeholder=""
                value="1"
              />
              <br />
              <button className="btn btn-primary">submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
