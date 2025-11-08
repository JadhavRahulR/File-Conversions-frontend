import React from "react";
import "./LandingPage.css";
import { Link } from 'react-router-dom'
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import IntroVideo from "../src/assets/videos/Fileunivers-Introduction-Video.mp4"
import IntroPoster from "../src/assets/images/Fileunivers-intro-poster.png"

export default function LandingPage() {
  return (
    <>
    <Helmet>
        <title>F I L E - U N I V E R S – Free Online PDF Converter & File Compressor Tool</title>
        <meta name="description" content="Free online file converter & compressor. Convert PDF, Word, Excel, images & more in seconds with FileUnivers – fast, secure & easy-to-use tools." />
        <link rel="canonical" href="https://fileunivers.in/" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="file converter, file compressor, convert files online, compress files online, pdf converter, image to pdf, doc to pdf, zip extractor, pdf merger, folder to zip" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <meta property="og:title" content="Convert & Compress Files Online | FileUnivers Tools" />
        <meta property="og:description" content="Use our complete toolset to convert and compress PDFs, DOCX, PPTX, Excel, images, and more in one place. Fast, free, and user-friendly." />
        <meta property="og:url" content="https://fileunivers.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FileUnivers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Convert & Compress Files Online | FileUnivers Tools" />
        <meta name="twitter:description" content="All your file conversion and compression tools in one place. Start converting and compressing now." />


      </Helmet>
      <ScrollToTop />
        <div className="landing-page">
     <header className="hero">
  <h1>Free & Secure Online File Converter – Convert PDF, Word, Excel & Images Instantly</h1>
  <p>
    Convert your files quickly and securely with FileUnivers. 
    Our free online converter lets you turn PDFs, Word docs, Excel sheets, 
    PowerPoint slides, and images into any format — no signup, no limits, just instant conversion.
  </p>
</header>


      <section className="features">
        <h2>Supported Conversions</h2>
        <div className="feature-grid">
          <li><Link to="/word-to-pdf" className=''><FeatureCard title="WORD → PDF" image1="/word.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/pdf-to-word" >  <FeatureCard title="PDF → WORD" image2="word.png" image1="/pdf.png" /></Link></li>
          <li><Link to="/odt-to-pdf">  <FeatureCard title="ODT → PDF" image1="/odt.png" image2="pdf.png " /></Link></li>
          <li><Link to="/pdf-to-odt">  <FeatureCard title="PDF → ODT" image1="/pdf.png" image2="odt.png " /></Link></li>
          <li><Link to="/text-to-pdf">  <FeatureCard title="TEXT → PDF" image1="/txt.png" image2="pdf.png" /></Link></li>
          <li><Link to="/pdf-to-txt">  <FeatureCard title="PDF → TEXT" image2="/txt.png" image1="pdf.png" /></Link></li>
          <li><Link to="/doc-to-odt">  <FeatureCard title="DOC → ODT" image1="/word.png" image2="odt.png " /> </Link></li>
          <li><Link to="/odt-to-doc" > <FeatureCard title="ODT → DOC" image1="/odt.png" image2="word.png " /> </Link></li>
          <li><Link to="/pptx-to-pdf" > <FeatureCard title="PPTX → PDF" image1="/pptx.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/pdf-to-pptx" > <FeatureCard title="PDF → PPTX" image1="/pdf.png" image2="pptx.png" /> </Link></li>
          <li><Link to="/pptx-to-odp" > <FeatureCard title="PPTX → ODP" image1="/pptx.png" image2="odp.png" /></Link></li>
          <li><Link to="/odp-to-pptx" > <FeatureCard title="ODP → PPTX" image1="/odp.png" image2="pptx.png" /></Link></li>
          <li><Link to="/rtf-to-pdf" ><FeatureCard title="RTF → PDF" image1="/rtf.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/pdf-to-rtf" ><FeatureCard title="PDF → RTF" image1="/pdf.png" image2="rtf.png" /> </Link></li>
          <li><Link to="/html-to-pdf" ><FeatureCard title="HTML → PDF" image1="/html.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/md-to-pdf" ><FeatureCard title="MD → PDF" image1="/md.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/xlsx-to-pdf" ><FeatureCard title="XLSX → PDF" image1="/xlsx.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/csv-to-pdf" ><FeatureCard title="CSV → PDF" image1="/csv.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/img-to-pdf" > <FeatureCard title="IMG → PDF" image1="/img.png" image2="pdf.png" /> </Link></li>
          <li><Link to="/tiff-to-pdf" ><FeatureCard title="TIFF → PDF" image1="/tiff.png" image2="pdf.png" /> </Link></li>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">

        <h2>Ready to Convert?</h2>
        <p>No signup needed. Convert your files in seconds.</p>
        <Link to='/word-to-pdf'>  <button className="primary-btn">Start Now</button></Link>
      </section>
      {/* Intro Video Section */}
<section className="intro-video-section">
  <div className="intro-text">
    <h2>What is FileUnivers?</h2>
    <p>
      Watch a quick introduction to see various FileUnivers conversion options  – & this options are  free, fast, and secure.
    </p>
  </div>

  <div className="intro-video-container">
    <video
      id="introVideo"
      className="intro-video"
      playsInline
      muted
      // loop
      // autoPlay
      preload="none"
      poster={IntroPoster}
      controls
    >
      <source src={IntroVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</section>

{/* Lazy-load logic */}
<script dangerouslySetInnerHTML={{
  __html: `
  document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("introVideo");
    if (!video) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.load(); // starts loading when visible
            observer.unobserve(video);
          }
        });
      });
      observer.observe(video);
    } else {
      video.load();
    }
  });
  `
}} />

      <section className="cta">
        <h2>Compress Files, Images & Documents Online – Free ZIP & PDF Tools</h2>
<div className="paragraph">
  <p>
    Reduce file size without losing quality. Compress PDFs, Word documents, Excel sheets, 
    and images instantly with FileUnivers. Our free online tools also let you 
    <b> convert folders to ZIP, extract ZIP files, and merge multiple PDFs </b> 
    — fast, secure, and easy to use.
  </p>
</div>

        <br />
        <div className="feature-grid">

          <li><Link to="/pdf-compressor" ><FeatureCard1 title="Compress PDF" image1="pdf.png" /> </Link></li>
          <li><Link to="/img-compressor" ><FeatureCard1 title="Compress Image" image1="img.png" /> </Link></li>
          <li><Link to="/csvcompress" ><FeatureCard1 title="Compress CSV" image1="csv.png" /> </Link></li>
          <li><Link to="/pptxcompress" ><FeatureCard1 title="Compress PPTX" image1="pptx.png" /> </Link></li>
          <li><Link to="/docxcompressor" ><FeatureCard1 title="Compress WORD" image1="word.png" /> </Link></li>
          <li><Link to="/xlsxcompressor" ><FeatureCard1 title="Compress XLSX" image1="xlsx.png" /> </Link></li>
          <li><Link to="/odtcompressor" ><FeatureCard1 title="Compress ODT" image1="odt.png" /> </Link></li>
          <li><Link to="/odpcompressor" ><FeatureCard1 title="Compress ODP" image1="odp.png" /> </Link></li>
          <li><Link to="/tiffcompressor" ><FeatureCard1 title="Compress TIFF" image1="tiff.png" /> </Link></li>
          <li><Link to="/bmpcompressor" ><FeatureCard1 title="Compress BMP" image1="file.png" /> </Link></li>
          <li><Link to="/merge-pdf" ><FeatureCard1 title="Merge PDF's " image1="pdf.png" /> </Link></li>
          <li><Link to="/zip-compressor" ><FeatureCard1 title="Convert File to Zip" image1="zip.png" /> </Link></li>
          <li><Link to="/zip-extractor" ><FeatureCard1 title="Extract Zip File " image1="unzip.png" /> </Link></li>
          <li><Link to="/favicon-generator" ><FeatureCard1 title="Favicon Generator" image1="Fav.png" /> </Link></li>
          <li><Link to="renamefile" ><FeatureCard1 title="Rename Your File" image1="rename.png" /> </Link></li>
        </div>
      </section>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>Is FileUnivers free to use?</h3>
          <p>Yes, all file conversion and compression tools on FileUnivers are completely free to use without registration.</p>
        </div>

        <div className="faq-item">
          <h3>Is my uploaded data secure?</h3>
          <p>Yes. Your files are transmitted over HTTPS and are deleted from our servers automatically after conversion.</p>
        </div>

        <div className="faq-item">
          <h3>What file formats do you support?</h3>
          <p>We support PDF, Word, Excel, PowerPoint, ODT, BMP, TIFF, CSV, HTML, Markdown, and more for both conversion and compression.</p>
        </div>

        <div className="faq-item">
          <h3>Do I need to sign up to convert files?</h3>
          <p>No sign-up is required. You can start converting or compressing files instantly.</p>
        </div>

        <div className="faq-item">
          <h3>Can I use FileUnivers on mobile devices?</h3>
          <p>Yes, our tools are fully responsive and work seamlessly on mobile, tablet, and desktop devices.</p>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
    
    </>
  );
}

function FeatureCard({ title, image1, image2 }) {
  return (
    <div className="feature-card">
      <div className="icon"><img src={image1} width="40px" alt="no data" />→<img src={image2} width="40px" alt="no data" /></div>
      <h5>{title}</h5>
    </div>
  );
}
function FeatureCard1({ title, image1, image2 }) {
  return (
    <div className="feature-card">
      <div className="icon"><img src={image1} width="40px" alt="no data" /></div>
      <h5>{title}</h5>
    </div>
  );
}

