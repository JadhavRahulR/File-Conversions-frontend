import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import './CsvCompressor.css';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to generate favicon.mp4";
import IntroPoster from "../src/assets/images/generate favicon poster.png";

const FaviconGenerator = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setStatus("idle");
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
        setStatus("idle");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const handleGenerate = async () => {
        if (!file) return alert("Please select an image first.");

        setStatus("generating");

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            const zip = new JSZip();
            const sizes = [16, 32, 48, 64, 128, 256];
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            for (const size of sizes) {
                canvas.width = canvas.height = size;
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);

                const data = canvas.toDataURL("image/png");
                const blob = await (await fetch(data)).blob();
                zip.file(`favicon-${size}x${size}.png`, blob);
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "favicons.zip");
            setStatus("done");
        };
    };

    return (
        <>
            <Helmet>
                <title> Favicon Generator Free – Fast & Secure Online Favicon Maker | FileUnivers</title>
                <meta name="description" content="Free Favicon Generator – Create favicons of all sizes (16x16, 32x32, 48x48 & more) instantly online. Fast, secure, and privacy-safe favicon.ico maker — no uploads required." />
                <link rel="canonical" href="https://fileunivers.in/favicon-generator" />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <ScrollToTop />
            <div className="pagetitle">
            <h1> Favicon Generator Free – Fast, Secure & Online Icon Maker (ICO, PNG, SVG)</h1>
                <p className="intro-paragraph">
                    Easily generate favicons online and create beautiful website icons in formats like ICO, PNG, or SVG within seconds. Whether you’re designing a new website or refreshing your brand identity, this free favicon generator helps you create professional icons directly from images, logos, or text — no design software needed. Just upload your image, choose the size, and download your ready-to-use favicon instantly.
                </p>
            </div>
            <div className="compressor-container drop-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}>

                <p
                    className="file-label clickable-label"
                    onClick={() => fileInputRef.current.click()}
                >
                    {file
                        ? `✅ Selected: ${file.name}`
                        : "📂 Click or drag & drop an image (PNG, JPG,JPEG,SVG)"}
                </p>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden-input"
                />

                {preview && (
                    <div style={{ margin: "10px 0" }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                )}
                <div className="fileuploadcontainer">
                    <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['jpg', 'jpeg', 'png']} />
                    <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['jpg', 'jpeg', 'png']} />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!file || status === "generating"}
                    style={{ marginTop: '10px' }}
                >
                    {status === "generating" ? "⚙️ Generating..." : "Generate Favicons"}
                </button>

                {status === "done" && (
                    <p className="success-msg">✅ Favicons generated and downloaded!</p>
                )}
            </div>
            <div>
                <section className="compressor-page">
                    <h2>Free Online Favicon Generator – Create Fast, Secure, and High-Quality Favicons</h2>
                    <p>
                        Welcome to the <strong>Free Favicon Generator</strong> by FileUnivers — your simple, fast, and secure way
                        to create professional favicon icons for your website or app. With just one image upload, you can generate
                        all required favicon sizes including 16×16, 32×32, 48×48, and even high-resolution icons for modern browsers,
                        Android, and iOS devices. No sign-up, no watermark, and everything runs directly in your browser.With FileUnivers.in, you get a fast, simple, and high-quality solution to generate favicons that make your website stand out.
                    </p>
                    <div className="converterImg">
            <div >
              <img src="Fav.png" alt="fav Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>FAVICON</p>
            </div>
          </div>

                    <h2>What is a Favicon Generator?</h2>
                    <p>
                        A <strong>favicon generator</strong> is an online tool that converts your logo or image into different icon sizes
                        used by websites, mobile apps, and browsers. Favicons (short for “favorite icons”) are the tiny graphics that
                        appear in browser tabs, bookmarks, search engine results, and mobile home screens. They give your brand identity,
                        increase recognition, and make your website look professional.
                    </p>
                    <p>
                        FileUnivers’s <strong>favicon generator online</strong> allows you to instantly generate multiple icon resolutions
                        without needing any software. Whether you upload a <strong>PNG, JPG, or SVG</strong> file, the tool automatically
                        converts it into compatible favicon formats — ready for download and use.
                    </p>
                    <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Generate Favicon ? "
              description='Create your website icon in seconds!. This video shows how to generate favicons online (ICO, PNG, SVG) from your logo or image — no design skills required. In this video, you’ll learn: How to upload an image or logo ,Generate favicon in multiple formats (ICO, PNG, SVG) Download and add it to your website easily.'
            />
          </section>

                    <h2>How to Use the Favicon Generator</h2>
                    <ol>
                        <li><strong>Upload your logo or image:</strong> Choose a clear PNG, JPG, or SVG file from your device.</li>
                        <li><strong>Click “Generate Favicons”:</strong> The tool instantly creates all required favicon sizes in one click.</li>
                        <li><strong>Download ZIP package:</strong> Get a ready-to-use ZIP file containing all favicon versions.</li>
                        <li><strong>Add to your website:</strong> Extract the files and link the favicon.ico in your website’s HTML &lt;head&gt; tag.</li>
                    </ol>

                    <h2>Why Use FileUnivers Favicon Generator?</h2>
                    <ul>
                        <li>⚡ <strong>Fast and Instant:</strong> Generates favicons within seconds — no waiting or uploads to external servers.</li>
                        <li>🧩 <strong>All Formats Supported:</strong> Works with PNG, JPG, and SVG files effortlessly.</li>
                        <li>🔒 <strong>Privacy-Safe & Secure:</strong> All processing happens in your browser; your images are never uploaded.</li>
                        <li>💾 <strong>Download as ZIP:</strong> Get all favicon sizes bundled and ready for use.</li>
                        <li>📱 <strong>Cross-Platform Compatible:</strong> Favicons work perfectly for browsers, Android, and iOS shortcuts.</li>
                        <li>🌐 <strong>SEO Friendly:</strong> Helps improve brand visibility in search engine results and browser tabs.</li>
                        <li>🎨 <strong>High-Quality Output:</strong> Maintains color accuracy and sharpness across all icon sizes.</li>
                    </ul>

                    <h2>Benefits of Having a Favicon</h2>
                    <p>
                        Having a favicon is more than just a design choice — it’s a crucial part of branding and user experience.
                        When users open multiple tabs, your favicon helps them identify your site instantly. It also adds credibility,
                        improves SEO click-through rates, and enhances your professional image. Without a favicon, your site may look incomplete
                        or less trustworthy in search results and browser tabs.
                    </p>

                    <h2>Best Practices for Creating Favicons</h2>
                    <ul>
                        <li>✔️ Use a simple design or lettermark that remains clear even at 16×16 pixels.</li>
                        <li>✔️ Avoid small text or complex patterns that may blur at smaller resolutions.</li>
                        <li>✔️ Choose high-contrast colors to make your icon stand out on both light and dark themes.</li>
                        <li>✔️ Keep the background transparent or solid for clarity across all platforms.</li>
                        <li>✔️ Test your favicon in multiple browsers before final use.</li>
                    </ul>

                    <h2>Frequently Asked Questions (FAQ)</h2>
                    <h3>1. Is this favicon generator really free?</h3>
                    <p>
                        Yes! The FileUnivers favicon generator is 100% free to use. There are no hidden costs or sign-ups required.
                        You can generate and download as many favicons as you like.
                    </p>

                    <h3>2. Does it work offline or require uploads?</h3>
                    <p>
                        Everything runs directly in your browser. No image is uploaded to any server, making it one of the most
                        secure favicon tools available online.
                    </p>

                    <h3>3. Can I use SVG files for better quality?</h3>
                    <p>
                        Absolutely! Uploading an SVG ensures your favicon scales perfectly without losing quality.
                        The tool automatically converts it to multiple raster sizes for compatibility.
                    </p>

                    <h3>4. What file formats are included in the ZIP?</h3>
                    <p>
                        The ZIP file includes standard favicon.ico along with PNG icons (16×16, 32×32, 48×48, 64×64, 128×128, etc.),
                        making it ready for immediate website integration.
                    </p>

                    <h2>How to Add Favicon to Your Website</h2>
                    <p>
                        After downloading the ZIP file, extract it and place the <code>favicon.ico</code> in your website’s root folder.
                        Then, add this simple line inside your <code>&lt;head&gt;</code> tag:
                    </p>
                    <pre>
                        &lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;
                    </pre>
                    <p>
                        This ensures that browsers automatically detect and display your favicon whenever your site loads.
                    </p>

                    <h2>Try Other Free Tools on FileUnivers</h2>
                    <ul>
                        <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
                                    <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
                                    <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
                                    <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
                                    <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
                                    <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
                                    <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
                                    <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
                                    <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
                                    <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
                                    <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
                                    <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
                                    <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
                                    <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
                                    <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                                    <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
                    </ul>

                    <p>
                        The FileUnivers favicon generator is built for web designers, developers, and businesses who want a
                        <strong>fast, secure, and reliable favicon creation tool</strong>. Whether you’re launching a new website or updating
                        your brand identity, this free online favicon maker gives you everything you need — instantly.
                    </p>
                </section>
            </div>

        </>
    );
};

export default FaviconGenerator;
