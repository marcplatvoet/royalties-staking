// Import the ethers library
import React from "react";
//import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import { getBalance } from "../components/token";

const artist = ({ signerAddress, mytoken, currentAccount, addMessage }) => {
  const onClickFunction = async (e) => {
    e.preventDefault();
    getBalance(mytoken, e.target.elements.to.value);

    const to = e.target.elements.to.value;
    const amount = e.target.elements.amount.value;
    if (amount < 10) {
      await mytoken.addRoyaltiesAccount(to, amount);
    } else {
      const message = [
        {
          head: "Percentage to high.",
          body: "Percentage cannot be higher or equal to 10.",
          variant: "info",
        },
      ];
      addMessage(message);
    }
  };

  return (
    <div>
      <h1>Artist</h1>
      <br />

      <div className="card col-sm-8 bg-secondary">
        Only the owner of the smart contract can set this up! On this page you
        can add the account of the artist to the smart contract. The royalties
        percentage is payed for any transaction on the blockchain. you have to
        own the account to set this up, when you are connected to Metamask with
        the account you can submit this change to the smart contract.
      </div>
      <br />
      <div className="row mb-3">
        <div className="col-4 card col-sm-8 bg-secondary">
          <div className="card-body">
            <div className="card-header">Add artist to the smart contract.</div>
            <form onSubmit={(e) => onClickFunction(e)}>
              Royalties send to address:
              <input
                type="text"
                name="to"
                className="form-control"
                placeholder=""
              />
              Percentage of royalties:
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

export default artist;
