import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import Home from "../pages/index";
import AboutUs from "../pages/about";
import ContactUs from "../pages/contactus";

const navbar = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <Router>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
              <Navbar.Brand href="#home">React Bootstrap Navbar</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/about-us">Contact Us</Nav.Link>
                  <Nav.Link href="/contact-us">About Us</Nav.Link>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
              <div>
                <Button onClick={SignIn} variant="primary">
                  Connect
                </Button>{" "}
                <Button
                  onClick={SignOut}
                  style={{ visibility: isLogged ? "visible" : "hidden" }}
                  variant="danger"
                >
                  X
                </Button>
              </div>
            </Navbar>
            <br />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about-us">
                <AboutUs />
              </Route>
              <Route path="/contact-us">
                <ContactUs />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default navbar;
