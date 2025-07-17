import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'
import "./navbar.css"
import { useState } from 'react';

function Navbar1() {
  const [color, SetColor] = useState('')
  // const [color1 , SetColor1] = useState('')
  const changeColor = () =>{
      const navcoler = "white";
      SetColor(color== '' ? "white" :"")
  }
  const changecolor = () =>{
    SetColor(color=="white" ? "" : "white")
    // SetColor("")
    // const navcolor = 'white';
    
  }
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container className='my-2'>
          <Navbar.Brand className='navbarlogo'><Link to="/">🌐 N L I N E - C O N V E R T E R </Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
          <Link to="/aboutus" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> About US </Navbar.Toggle></Link>
          <Link to="/toolspg" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Tool</Navbar.Toggle></Link>
          <Link to="/pdf-compressor" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Compress PDF </Navbar.Toggle></Link>
          <Link to="/merge-pdf" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Merge PDF </Navbar.Toggle></Link>
          <Link to="/privacy-policy" className="pages" > <Navbar.Toggle aria-controls="basic-navbar-nav" className='hello'> Privacy-Policy</Navbar.Toggle></Link>
          <div className="displaynone">
              {/* <Link to="/home" className="pages">Home</Link> */}
              <Link to="/toolspg" className="pages">Tools </Link>
              <Link to="/pdf-compressor" className="pages"> Compress PDF </Link>
              <Link to="/merge-pdf" className="pages"> Merge PDFs </Link>
              <Link to="/aboutus" className="pages" onClick={changeColor} style={{color}}>About Us </Link>
              <Link to="/privacy-policy" className="pages" onClick={changecolor}  >Privacy Policy</Link>
          </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbar1;