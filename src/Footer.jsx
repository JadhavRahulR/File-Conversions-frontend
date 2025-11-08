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
        <div className="toollinks">
          {/* <p> * T O O L S *</p> */}
          <Link to = '/word-to-pdf'>WORD To PDF</Link>
          <Link to = '/pdf-to-word'>PDF To WORD</Link>
          <Link to = '/favicon-generator'>FAVICON GENERATOR</Link>
          <Link to = '/merge-pdf'>MERGE PDFS</Link>
        </div>
        <p className="footer-note" > &copy; {new Date().getFullYear()}   " F I L E - U N I V E R S "  . All rights reserved.</p>


      </footer>
    </div>
  )
}

export default Footer