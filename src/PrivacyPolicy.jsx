import React from "react";
import "./PrivacyPolicy.css";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
    <div className="privacy-container">
      <ScrollToTop/>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> August 1, 2025</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect:</p>
        <ul>
          <li><strong>Uploaded Files:</strong> Temporarily stored during conversion and deleted automatically after processing.</li>
          <li><strong>Google Drive Files:</strong> Access only to selected files, nothing else.</li>
          <li><strong>Dropbox Files:</strong> Access only to selected files, nothing else.</li>
          <li><strong>Usage Data:</strong> Anonymous analytics to improve service quality.</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>Your data is used only to:</p>
        <ul>
          <li>Process and convert your files</li>
          <li>Improve the app experience</li>
          <li>Ensure system security</li>
        </ul>
      </section>

      <section>
        <h2>3. File Storage and Deletion</h2>
        <p>All uploaded files are deleted shortly after conversion. We don’t permanently store your files.</p>
      </section>

      <section>
  <h2>4. Third-Party Services</h2>
  <p>We use third-party services to enhance file import and processing:</p>
  <ul>
    <li>
      <strong>Google Drive:</strong> We access only the file you select for conversion. We do not access or store any other Drive files.
    </li>
    <li>
      <strong>Dropbox:</strong> We use the Dropbox Chooser to let you select a file. Only the selected file's link is accessed. We do not have access to your full Dropbox account or any other files.
    </li>
  </ul>
  <p>
    These third-party services have their own privacy policies:
    <br />
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
      Google Privacy Policy
    </a>
    <br />
    <a href="https://www.dropbox.com/privacy" target="_blank" rel="noopener noreferrer">
      Dropbox Privacy Policy
    </a>
  </p>
</section>


      <section>
        <h2>5. Contact Us</h2>
        <p>For any questions, contact us at <a href="mailto:your-email@example.com">fileunivers@gmail.com</a>.</p>
      </section>

      <section>
        <h2>6. Changes to This Policy</h2>
        <p>We may update this page. Please review it periodically.</p>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;
