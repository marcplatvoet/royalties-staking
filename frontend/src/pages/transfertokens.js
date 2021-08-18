// Import the ethers library
import { React, useState } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import MyToken from "../contracts/MyToken.json";

const Transfertokens = ({
  signerAddress,
  mytoken,
  currentAccount,
  addMessage,
}) => {
  const [balancefrom, setBalanceFrom] = useState(0);
  const [balanceto, setBalanceTo] = useState(0);
  const [balanceartist, setBalanceArtist] = useState(0);

  const onTransferTokensWithoutRoyalties = async (e) => {
    e.preventDefault();
    const from = e.target.elements.from.value;
    const to = e.target.elements.to.value;
    const amount = e.target.elements.amount.value;
    console.log(from);
    console.log(to);
    await mytoken.transfer(to, ethers.utils.parseUnits(amount));
  };

  const onTransferTokensWithRoyalties = async (e) => {
    try {
      e.preventDefault();
      const from = e.target.elements.from.value;
      const to = e.target.elements.to.value;
      const amount = e.target.elements.amount.value;
      console.log(from);
      console.log(to);
      await mytoken.transferWithRoyalies(to, ethers.utils.parseUnits(amount));
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
              Transfer tokens without royalties.
            </div>
            <form onSubmit={(e) => onTransferTokensWithoutRoyalties(e)}>
              From address:
              <input
                type="readonly"
                name="from"
                className="form-control"
                placeholder=""
                value={currentAccount}
              />
              To address:
              <input
                type="text"
                name="to"
                className="form-control"
                placeholder=""
              />
              Amount:
              <input
                type="text"
                name="amount"
                className="form-control"
                placeholder=""
              />
              <br />
              <button className="btn btn-primary">submit</button>
            </form>
          </div>
        </div>

        <div className="col-lg-6  card col-sm-8 bg-secondary">
          <div className="card-body">
            <div className="card-header">Transfer tokens with royalties.</div>
            <form onSubmit={(e) => onTransferTokensWithRoyalties(e)}>
              From address:
              <input
                type="readonly"
                name="from"
                className="form-control"
                placeholder=""
                value={currentAccount}
              />
              To address:
              <input
                type="text"
                name="to"
                className="form-control"
                placeholder=""
              />
              Amount:
              <input
                type="text"
                name="amount"
                className="form-control"
                placeholder=""
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

export default Transfertokens;
