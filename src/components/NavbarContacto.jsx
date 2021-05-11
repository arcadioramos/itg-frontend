import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.css';
import '../../src/App.css'

class NavbarContacto extends Component {

  render() {
    return (
      <>
        <Navbar className="color-nav-contacto w-100" collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link className="color-nav-contacto" href="/contacto">Contacto</Nav.Link>
              <Nav.Link className="color-nav-contacto" href="/mapaSitio">Mapa del sitio</Nav.Link>
              <Nav.Link className="color-nav-contacto" href="http://187.243.249.26:1000/">SII</Nav.Link>
              <Nav.Link className="color-nav-contacto" href="http://mail.Tecnm.mx" target="_blank">Correo institucional</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default NavbarContacto;