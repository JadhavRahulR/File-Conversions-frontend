import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom'
import "./navbar.css"
import { useState } from 'react';

function Navbar1() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => { setMenuOpen(false); };



  return (<header className="site-navbar">
    <div className="site-navbar-container"> {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={closeMenu} aria-label="FileUnivers Home" > 🌐 F I L E - U N I V E R S </Link> 
      {/* Hamburger */} 
      <button type="button" className={`navbar-hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen((prev) => !prev)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" > <span></span> <span></span> <span></span> </button>
      {/* Navigation */} <nav id="main-navigation" className={`navbar-menu ${menuOpen ? "open" : ""}`} > <NavLink to="/tools" className="navbar-link" onClick={closeMenu} > Tools </NavLink>
       <NavLink to="/pdf-compressor" className="navbar-link" onClick={closeMenu} > Compress PDF </NavLink>
       <NavLink to="/merge-pdf" className="navbar-link" onClick={closeMenu} > Merge PDF </NavLink> 
       <NavLink to="/aboutus" className="navbar-link" onClick={closeMenu} > About Us </NavLink>
       <NavLink to="/blog" className="navbar-link" onClick={closeMenu} > Blogs </NavLink> 
       </nav>
        </div> 
      
      </header>);
};
export default Navbar1;