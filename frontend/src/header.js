// import logo from "./logo.svg";
// import React from "react";
// import Chain from "./components/chain";
// import LoginButton from "./components/loginbutton";
// import { Navbar, Container, Row, Col, Button, Alert } from "react-bootstrap";

// const Header = ({
//   onLinkClick,
//   currentChainID,
//   isLogged,
//   currentAccount,
//   message,
// }) => {
//   const shortAddr = (currentAccount) => {
//     return `${currentAccount.substr(0, 4)}...${currentAccount.substring(
//       currentAccount.length - 4,
//       currentAccount.length
//     )}`;
//   };

//   return (
//     <div>
//       <Navbar bg="dark" className="justify-content-between" variant="dark">
//         <Navbar.Brand href="#home">
//           <img
//             alt=""
//             src={logo}
//             width="30"
//             height="30"
//             className="d-inline-block align-top App-logo"
//           />{" "}
//           <button
//             bg="dark"
//             className="btn btn-dark"
//             onClick={() => onLinkClick("about")}
//             variant="dark"
//           >
//             About
//           </button>
//           <button
//             bg="dark"
//             className="btn btn-dark"
//             onClick={() => onLinkClick("transfertokens")}
//             variant="dark"
//           >
//             Transfer Tokens
//           </button>
//           <button
//             bg="dark"
//             className="btn btn-dark"
//             onClick={() => onLinkClick("mint")}
//             variant="dark"
//           >
//             Mint Tokens
//           </button>
//           <button
//             bg="dark"
//             className="btn btn-dark"
//             onClick={() => onLinkClick("artist")}
//             variant="dark"
//           >
//             Artist
//           </button>
//         </Navbar.Brand>
//         <LoginButton
//           message={message}
//           currentAccount={currentAccount}
//           currentChainID={currentChainID}
//         ></LoginButton>
//       </Navbar>
//     </div>
//   );
// };

// export default Header;
