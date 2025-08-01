import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom'
import "./navbar.css"
import { useState } from 'react';

function Navbar1() {
  const [color, SetColor] = useState('')
  // const [color1 , SetColor1] = useState('')
  const changeColor = () =>{
      const navcoler = "white";
      SetColor(color== '' ? "white" :"")
  }
 
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container className='my-2'>
          <Navbar.Brand className='navbarlogo'><Link to="/">🌐 F I L E - U N I V E R S  </Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
          <Link to="/tools" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Tool</Navbar.Toggle></Link>
          <Link to="/pdf-compressor" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Compress PDF </Navbar.Toggle></Link>
          <Link to="/merge-pdf" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Merge PDF </Navbar.Toggle></Link>
          <NavLink to="/aboutus" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> About US </Navbar.Toggle></NavLink>
          <div className="displaynone">
              <NavLink to="/tools" className="pages">Tools </NavLink>
              <NavLink to="/pdf-compressor" className="pages"> Compress PDF </NavLink>
              <NavLink to="/merge-pdf" className="pages"> Merge PDFs </NavLink>
              <NavLink to="/aboutus" className="pages"  >About Us </NavLink>
          </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbar1;