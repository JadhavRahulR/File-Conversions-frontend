import Container from 'react-bootstrap/Container';
import "./footer.css"
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div>
      <footer>
        <div className="footerpages">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/aboutus">About Us </Link>
        </div>
        <p className="footer-note" > &copy; {new Date().getFullYear()} O N L I N E - C O N V E R T E R. All rights reserved.</p>


      </footer>
    </div>
  )
}

export default Footer