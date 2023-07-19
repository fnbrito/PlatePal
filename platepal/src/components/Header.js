import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Menu from './Menu';

function Header({ toggleMenu, isOpen }) {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand className="logo fs-2" href="#">PlatePal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Menu isOpen={isOpen} toggleMenu={toggleMenu} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
