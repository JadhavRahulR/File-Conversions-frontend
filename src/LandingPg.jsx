import React from "react";
import "./LandingPage.css"; 
import { Link } from 'react-router-dom'
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Helmet>
        <title>F I L E - U N I V E R S </title>
<meta name="description" content="Convert and compress your files effortlessly with FileUnivers. Use our free tools to transform PDFs, Word, Excel, images, and more—all in one place, no signup needed." />
<link rel="canonical" href="https://fileunivers.in/" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="file converter, file compressor, convert files online, compress files online, pdf converter, image to pdf, doc to pdf, zip extractor, pdf merger, folder to zip" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop/>
      <header className="hero">
        <h1>Convert Files Instantly</h1>
        <p>
          Fast, secure, and free file conversion tool. Convert Word, PDF, Excel,
          Images, and more in just a few clicks.
        </p>
      </header>

      <section className="features">
        <h2>Supported Conversions</h2>
        <div className="feature-grid">
          <li><Link to="/word-to-pdf" className=''><FeatureCard title="Word → PDF" image1="/word.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/pdf-to-word" >  <FeatureCard title="PDF → Word" image2="word.png" image1="/pdf.png"/></Link></li>
        <li><Link to="/odt-to-pdf">  <FeatureCard title="odt → PDF"  image1="/odt.png" image2="pdf.png "/></Link></li>
        <li><Link to="/pdf-to-odt">  <FeatureCard title="PDF → odt"  image1="/pdf.png" image2="odt.png "/></Link></li>
        <li><Link to="/text-to-pdf">  <FeatureCard title="Text → PDF" image1="/txt.png" image2="pdf.png" /></Link></li>
        <li><Link to="/pdf-to-txt">  <FeatureCard title="PDF → Text"  image2="/txt.png" image1="pdf.png"/></Link></li>
        <li><Link to="/doc-to-odt">  <FeatureCard title="doc → odt"  image1="/word.png" image2="odt.png "/> </Link></li>
        <li><Link to="/odt-to-doc" > <FeatureCard title="odt → doc"  image1="/odt.png" image2="word.png "/> </Link></li>
        <li><Link to="/pptx-to-pdf" > <FeatureCard title="pptx → pdf" image1="/pptx.png" image2="pdf.png" /> </Link></li>
        <li><Link to="/pdf-to-pptx" > <FeatureCard title="pdf → pptx" image1="/pdf.png" image2="pptx.png" /> </Link></li>
        <li><Link to="/pptx-to-odp" > <FeatureCard title="pptx → odp" image1="/pptx.png" image2="odp.png" /></Link></li>
        <li><Link to="/odp-to-pptx" > <FeatureCard title="odp → pptx" image1="/odp.png" image2="pptx.png"/></Link></li>
        <li><Link to="/rtf-to-pdf" ><FeatureCard title="rtf → pdf"  image1="/rtf.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/pdf-to-rtf" ><FeatureCard title="pdf → rtf"  image1="/pdf.png" image2="rtf.png"/> </Link></li>
        <li><Link to="/html-to-pdf" ><FeatureCard title="html → PDF" image1="/html.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/md-to-pdf" ><FeatureCard title="md → PDF"   image1="/md.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/xlsx-to-pdf" ><FeatureCard title="XLSX → PDF" image1="/xlsx.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/csv-to-pdf" ><FeatureCard title="csv → PDF" image1="/csv.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/img-to-pdf" > <FeatureCard title="img → PDF" image1="/img.png" image2="pdf.png"/> </Link></li>
        <li><Link to="/tiff-to-pdf" ><FeatureCard title="TIFF → PDF" image1="/tiff.png" image2="pdf.png"/> </Link></li>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">

        <h2>Ready to Convert?</h2>
        <p>No signup needed. Convert your files in seconds.</p>
      <Link to='/word-to-pdf'>  <button className="primary-btn">Start Now</button></Link>
      </section>
      <section className="cta">
        <h2>Compress files, images  </h2>
        <div className="paragraph">

        <p>compress files like PDF, Word , Images , etc...<b>  other tool </b> like Covert folder to zip , extract zip Folder  & Merge PDFs</p>
        </div>
        <br />
         <div className="feature-grid">

          <li><Link to="/pdf-compressor" ><FeatureCard1 title="Compress PDF" image1="pdf.png" /> </Link></li>
          <li><Link to="/img-compressor" ><FeatureCard1 title="Compress Image" image1="img.png" /> </Link></li>
          <li><Link to="/csvcompress" ><FeatureCard1 title="Compress csv" image1="csv.png" /> </Link></li>
          <li><Link to="/pptxcompress" ><FeatureCard1 title="Compress pptx" image1="pptx.png" /> </Link></li>
          <li><Link to="/docxcompressor" ><FeatureCard1 title="Compress Word" image1="word.png" /> </Link></li>
          <li><Link to="/xlsxcompressor" ><FeatureCard1 title="Compress Xlsx" image1="xlsx.png" /> </Link></li>
          <li><Link to="/odtcompressor" ><FeatureCard1 title="Compress ODT" image1="odt.png" /> </Link></li>
          <li><Link to="/odpcompressor" ><FeatureCard1 title="Compress Odp" image1="odp.png" /> </Link></li>
          <li><Link to="/tiffcompressor" ><FeatureCard1 title="Compress Tiff" image1="tiff.png" /> </Link></li>
          <li><Link to="/bmpcompressor" ><FeatureCard1 title="Compress Bmp" image1="file.png" /> </Link></li>
          
          <li><Link to="/merge-pdf" ><FeatureCard1 title="Merge PDF" image1="pdf.png" /> </Link></li>
          <li><Link to="/zip-compressor" ><FeatureCard1 title="Convert File to Zip" image1="zip.png" /> </Link></li>
          <li><Link to="/zip-extractor" ><FeatureCard1 title="Extract Zip File " image1="unzip.png" /> </Link></li>
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
      <Footer/>
    </div>
  );
}

function FeatureCard({ title,image1,image2 }) {
  return (
    <div className="feature-card">
      <div className="icon"><img src={image1} width="40px" alt="no data" />→<img src={image2} width="40px" alt="no data" /></div>
      <h5>{title}</h5>
    </div>
  );
}
function FeatureCard1({ title,image1,image2 }) {
  return (
    <div className="feature-card">
      <div className="icon"><img src={image1} width="40px" alt="no data" /></div>
      <h5>{title}</h5>
    </div>
  );
}
