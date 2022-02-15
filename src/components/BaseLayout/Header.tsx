import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import { useCurrentUser, logOut } from "features/auth";
import { useAppDispatch } from "app/hooks";

export function Header() {
  const { user } = useCurrentUser();
  const dispatch = useAppDispatch();
  return (
    <Navbar bg="dark" className="navbar-dark navbar-fixed-top mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MITOC Gear
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/people">
              People
            </Nav.Link>
            <Nav.Link as={Link} to="/gear">
              Gear
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {user != null && (
          <Nav className="justify-content-end">
            <NavDropdown
              title={`${user.firstName} ${user.lastName[0]}.`}
              id="nav-profile-dropdown"
            >
              <NavDropdown.Item onClick={() => dispatch(logOut())}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
