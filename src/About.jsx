import React from 'react'
import "./about.css"
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
function About() {
  return (
    <div>
      <div className="about-container">
        <ScrollToTop/>
        <h1>About Us </h1>
      <p className="about-text">
        Welcome to <span className="highlight">F I L E - U N I V E R S </span> – our simple and reliable tool for fast and accurate document conversion.
        Whether you're a student, professional, or anyone in need of converting Word, PDF, Excel, or text files, we've got you covered.
      </p>

      <h2 className="section-title">🌐 Our Mission</h2>
      <p className="about-text">
        We aim to provide a fast, secure, and user-friendly file conversion experience — without the need for sign-ups, watermarks.
        Your documents are your own, and we make sure they’re handled with care and privacy.
      </p>

      <h2 className="section-title">🛠️ How It Works</h2>
      <ul className="about-list">
        <li>Upload your document in any supported format</li>
        <li>We convert it instantly using open-source tools like LibreOffice</li>
        <li>Download your file in your preferred format</li>
      </ul>

      <h2 className="section-title">🧠 Technology Behind It</h2>
      <p className="about-text">
        This project is built using <strong>React</strong> (Frontend), <strong>Node.js</strong> (Backend), and <strong>LibreOffice & Python</strong> for actual file conversions.
        Everything runs securely on our servers to ensure smooth performance and great compatibility.
      </p>

      <h2 className="section-title">🙌 Why Choose Us?</h2>
      <ul className="about-list">
        <li>Free to use</li>
        <li>No watermark, no sign-up required</li>
        <li>Supports multiple document formats</li>
        <li>Responsive and mobile-friendly design</li>
        <li>Privacy-first: Files are not stored permanently</li>
      </ul>

      <h2 className="section-title">📬 Get in Touch</h2>
      <p className="about-end">
        Have feedback or questions? We’d love to hear from you.
        Reach out via email at <a href="mailto:support@quickconvert.io" className="email-link">support@quickconvert.io</a>.
      </p>

     
    </div>
    <Footer/>
    </div>
  )
}

export default About