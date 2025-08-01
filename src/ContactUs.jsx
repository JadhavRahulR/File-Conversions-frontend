import React from "react";
import "./ContactUs.css";
import { Helmet } from 'react-helmet-async';
const ContactUs = () => {
  return (
    <>
    <Helmet>
      <title>contact us page </title>
      <meta name="description" content="Convert PDF files to Word documents (.docx) quickly and securely. Free online PDF to Word converter with no email or signup required." />
        <link rel="canonical" href="http://localhost:5173/contactus" />
        <meta name="robots" content="index, follow" />
    </Helmet>
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or issues using our file
        conversion service, feel free to reach out.
      </p>

      <div className="contact-info">
       <p><strong>Email:</strong> <a href="mailto:fileunivers@gmail.com">fileunivers@gmail.com</a></p>

        <p><strong>Support Hours:</strong> Mon–Fri, 9am–6pm IST</p>
        <p><strong>Response Time:</strong> Within 24 hours</p>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
