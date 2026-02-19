import React, { useRef, useState } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to compress odt.mp4";
import IntroPoster from "../src/assets/images/odt compress poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdtCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [status, setStatus] = useState('upload');
  const [outputType, setOutputType] = useState('odt');
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  

  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.odt')) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('outputType', outputType);

    try {
      const response = await axios.post(`${BASE_URL}/compress-odt`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });
      const compressedODT = new File(
  [response.data],
  file.name.replace(/\.odt$/i, "") + "_compressed.odt",
  {
    type: "application/vnd.oasis.opendocument.text",
  }
);

setConvertedFile(compressedODT);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        file.name.replace('.odt', `_compressed.odt${outputType === '7z' ? '.7z' : ''}`)
      );
      document.body.appendChild(link);
      link.click();
      setStatus("✅ Done");
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress ODT | Reduce OpenDocument Text File Size</title>
        <meta name="description" content="Compress your ODT (OpenDocument Text) files online to reduce file size without losing formatting. Fast, secure, and free ODT compressor tool." />
        <link rel="canonical" href="https://fileunivers.com/odtcompressor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress odt, odt compressor, reduce odt file size, shrink opendocument text, compress opendocument, odt file compression online" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress ODT File Online -Free Reduce OpenDocument File Size Secure and Instantly</h1>
        <p className="intro-paragraph">
          Quickly compress ODT files online and reduce document size without affecting content, layout, or text formatting. Whether it’s an OpenOffice or LibreOffice document, this free online tool helps you make your ODT files lighter and easier to share- no software installation or registration required. Upload your file, choose the compression level, and get a smaller version in seconds.
        </p>
      </div>
      <div
        className="compressor-container "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="compressing">
          <h2>Compress ODT</h2>
        </div>
        <p
          className="file-label"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ cursor: 'pointer', }}
        >
          {file ? `✅ Selected: ${file.name}` : '   📂 Drag & drop a .odt file here, or click to select'}
        </p>

        <input
          type="file"
          accept=".odt"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ position: 'absolute', left: '-9999px' }}
          tabIndex={-1}
        />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
        </div>
        <div className="level-slider">
          <label>Image Quality: {quality}</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>   📉 Smaller</span>
            <span>     Clearer</span>
          </div>
        </div>

        <div className="output-select">
          <label>
            <input
              type="radio"
              name="odtOutputType"
              value="odt"
              checked={outputType === 'odt'}
              onChange={() => setOutputType('odt')}
            />
            Export as .odt
          </label>
          <label>
            <input
              type="radio"
              name="odtOutputType"
              value="7z"
              checked={outputType === '7z'}
              onChange={() => setOutputType('7z')}
            />
            Export as .odt.7z
          </label>
        </div>

        <button onClick={handleCompress} disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? `Compressing... (${progress}%)` : '    Compress'}
        </button>

        {status === 'done' && <p className="success-msg">✅ File compressed and downloaded!</p>}
        {status === 'error' && <p className="error-msg">   ❌ Compression failed</p>}

        {status === "✅ Done" && convertedFile && (
          <>
            <p style={{color:'white'}} >Save To . . .</p>
            <div className="saveTo">
              <SaveToGoogleDrive file={convertedFile} />
              <SaveToDropbox file={convertedFile} />
            </div>
          </>
        )}
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress ODT File Online</h2>
          <p className="compressor-description">
            Reduce the size of your OpenDocument Text (.odt) files without affecting formatting or content. Perfect for optimizing documents with images or media.Our smart ODT compressor removes unnecessary elements like embedded metadata and optimizes images for maximum file size reduction while maintaining top-quality visuals. Perfect for students, writers, and professionals who frequently work with OpenDocument files. Enjoy faster uploads, easier sharing, and reliable compression- all within a secure, browser-based tool powered by fileunivers.com.
          </p>
          <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="odt.png" alt="ODT Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>ODT</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Compress an ODT File?</h2>
          <ol className="compressor-steps">
            <li>   📂 Upload or drag & drop your <code>.odt</code> file</li>
            <li>   🎚️ Select a compression level if available</li>
            <li>🚀 Click <strong>Compress</strong> to start the process</li>
            <li>   ⬇️ Your compressed <code>.odt</code> file will auto-download when ready</li>
          </ol>
             <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress ODT ? "
              description='Shrink your OpenDocument (.odt) files in seconds!. This video shows how to compress ODT files online without losing text quality or formatting. In this video, you’ll learn:How to upload and compress ODT files easily Choose the best compression level Download your optimized ODT document instantly.'
            />
            </section>
          <h2 className="compressor-subheading">Why Use Our ODT Compressor?</h2>
          <ul className="compressor-benefits">
            <li>📝 Preserves original content and layout</li>
            <li>   📉 Reduces file size for easier sharing and storage</li>
            <li>🔐 Secure processing with no data stored</li>
            <li>⚡ Fast compression with automatic download</li>
            <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and odt file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
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
        </div>
        <section>
          <div className="compressor-article">
            <h2>Everything You Need to Know About ODT Compression</h2>

            <h3>📝 What is an ODT File?</h3>
            <p>
              ODT stands for Open Document Text. It’s the default format used by LibreOffice Writer and other open-source word processors. ODT files can include text, images, styles, and objects   —and may become large if they contain rich media.
            </p>

            <h3>   📦 Why Compress an ODT File?</h3>
            <p>
              If your ODT file has embedded images, charts, or unnecessary formatting, it can become too bulky for quick sharing or uploading. Compressing it helps you keep things efficient.
            </p>

            <h3>💡 Benefits of Compressing ODT Files</h3>
            <ul>
              <li><strong>   📉 Smaller Size</strong> - Reduce large document size without quality loss</li>
              <li><strong>🚀 Faster Upload</strong> - Share or email your file more quickly</li>
              <li><strong>   💾   Save Space</strong> - Keep your device or cloud storage tidy</li>
              <li><strong>📱 Easier Access</strong> - Open and edit documents more smoothly</li>
            </ul>

            <h3>⚙️ How Our ODT Compressor Works</h3>
            <p>
              Our tool compresses ODT files by optimizing embedded images and removing hidden content or unused formatting. It doesn’t touch your text, structure, or document design.
            </p>

            <h3>🔐 Is It Safe to Use This ODT Compressor?</h3>
            <p>
              Yes. Your ODT file is processed securely. We don’t store your content and all temporary files are deleted after compression.
            </p>
            <ul>
              <li>🔒Encrypted file handling</li>
              <li>🧹 Auto-delete after processing</li>
              <li> 🖥️Works on all platforms</li>
            </ul>

            <h3>📌Final Tip</h3>
            <p>
              Compressing your ODT files is ideal when submitting reports, sharing articles, or archiving long documents. Save time and space today with one click.
            </p>

            <h2>📚 Frequently Asked Questions</h2>

            <h3>❓ Will my document layout be affected?</h3>
            <p>
              No. The compressor preserves the document's layout, text, and formatting. Only images and metadata are optimized.
            </p>

            <h3>❓ Can I compress files with embedded graphics?</h3>
            <p>
              Yes, image-heavy ODT files benefit the most from compression. We reduce image size while maintaining clarity.
            </p>

            <h3>❓ What file formats are available after compression?</h3>
            <p>
              You can download the file as compressed `.odt` or as a `.odt.7z` archive for further space saving.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default OdtCompressor;
