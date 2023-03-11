import React, { useContext, useEffect, useState } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../images/logo.png";
import "./navigation.css";
import { useLocation, useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import axios from "axios";
import { AppContext } from "../context/appContext";
function NavigationBar() {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const { newMessages } = useContext(AppContext);
  useEffect(() => {
    let token = null;
    if (user) {
      token = user.token;
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
  }, [location]);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();
    const userr = {
      _id: user.user._id,
      newMessages,
    };
    // const res = await axios
    //   .post("https://chat-app-jet-two.vercel.app/logout", userr)
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const res = await axios
      .post("http://localhost:5000/logout", userr)
      .catch((err) => {
        console.log(err);
      });
    setUser(null);
    localStorage.removeItem("profile");
    navigate("/");
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <div className="logo">
          <LinkContainer to="/">
            <img src={logo} alt="" srcset="" />
          </LinkContainer>
        </div>
        <LinkContainer to="/">
          <Nav.Link>Chat App</Nav.Link>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user ? (
              <div>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </div>
            ) : (
              <></>
            )}
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            {user && (
              <NavDropdown
                title={
                  <>
                    <img src={user.user.picture} alt="" className="navDP" />
                    {user.user.name}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item classname="navDropdownItem">
                  <button className="logoutBtn" onClick={handleLogout}>
                    Logout
                  </button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
