import React from "react";
import "./TermsAndConditions.css";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

const TermsAndConditions = () => {
  return (
    <>
    <div className="terms-container">
      <ScrollToTop/>
      <h1>Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> July 9, 2025</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using our file conversion services, you agree to be bound by these Terms and Conditions.</p>
      </section>

      <section>
        <h2>2. User Responsibilities</h2>
        <p>You agree not to use the service for any unlawful or harmful activities, including but not limited to uploading malicious or copyrighted files without proper authorization.</p>
      </section>

      <section>
        <h2>3. File Processing</h2>
        <p>Uploaded files are processed temporarily for the purpose of conversion and are deleted shortly after. We do not retain your files beyond the conversion session.</p>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>We use third-party services such as Google Drive and Dropbox to enable file selection. We are not responsible for the data practices of these services.</p>
      </section>

      <section>
        <h2>5. Limitation of Liability</h2>
        <p>We are not liable for any loss, damage, or corruption of data during the use of our service. Use the service at your own risk.</p>
      </section>

      <section>
        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the service after changes means you accept the updated terms.</p>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>If you have any questions, please contact us at <a href="mailto:your-email@example.com">your-email@example.com</a>.</p>
      </section>
    </div>
      <Footer/>
    </>
  );
};

export default TermsAndConditions;
