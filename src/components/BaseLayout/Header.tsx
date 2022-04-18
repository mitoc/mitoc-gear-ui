import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import { useCurrentUser, logOut } from "features/auth";
import { useAppDispatch } from "app/hooks";
import { PersonLink } from "components/PersonLink";

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
            <Nav.Link
              href="https://docs.google.com/spreadsheets/d/1CW3j4K4_HmXlDbO1vPRvIW76SI41EYNbaZKKrqmrgTk/edit?hl=en&hl=en#gid=1019012678"
              target="_blank"
            >
              Restricted gear
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {user != null && (
          <Nav className="justify-content-end me-2">
            <NavDropdown
              title={`${user.firstName} ${user.lastName[0]}.`}
              id="nav-profile-dropdown"
            >
              <PersonLink className="dropdown-item" id={user.id}>
                My profile
              </PersonLink>
              <NavDropdown.Item href="http://goo.gl/nPMjmc" target="_blank">
                Request desk credit
              </NavDropdown.Item>
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
