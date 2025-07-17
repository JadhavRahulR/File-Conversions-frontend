import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <>
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or issues using our file
        conversion service, feel free to reach out.
      </p>

      <div className="contact-info">
        <p><strong>Email:</strong> <a href="mailto:support@fileconvertpro.com">support@fileconvertpro.com</a></p>
        <p><strong>Support Hours:</strong> Mon–Fri, 9am–6pm IST</p>
        <p><strong>Response Time:</strong> Within 24 hours</p>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
