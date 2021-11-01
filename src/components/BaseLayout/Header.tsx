import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

export function Header() {
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
      </Container>
    </Navbar>
  );
}
