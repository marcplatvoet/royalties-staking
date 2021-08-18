import logo from "./logo.svg";
import { Navbar } from "react-bootstrap";

function Header({ setThePage }) {
	return (
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
				onClick={() => setThePage("about")}
				variant="dark"
			>
				About
			</button>
			<button
				bg="dark"
				className="btn btn-dark"
				onClick={() => setThePage("transfertokens")}
				variant="dark"
			>
				Transfer Tokens
			</button>
			<button
				bg="dark"
				className="btn btn-dark"
				onClick={() => setThePage("mint")}
				variant="dark"
			>
				Mint Tokens
			</button>
			<button
				bg="dark"
				className="btn btn-dark"
				onClick={() => setThePage("artist")}
				variant="dark"
			>
				Artist
			</button>
		</Navbar.Brand>
	);
}

export default Header;
