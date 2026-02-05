import React, { useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import ScrollToTop from "./ScrollToTop";
import DriveFileInput from "./DriveFileInput";
import DropboxFileInput from "./DropboxFileInput";
import './CsvCompressor.css';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to rename your files.mp4";
import IntroPoster from "./assets/images/Rename your files poster.png";


const RenameFile = () => {
  const [file, setFile] = useState(null);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState("idle");
  const fileInputRef = useRef();

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Rename logic (frontend only)
  const handleRename = () => {
    if (!file || !newName.trim()) {
      alert("Please select a file and enter a new name.");
      return;
    }

    setStatus("renaming");
    const ext = file.name.substring(file.name.lastIndexOf("."));
    const renamedFile = new File([file], newName + ext, { type: file.type });

    // Trigger download
    const url = URL.createObjectURL(renamedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = renamedFile.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus("done");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Re-name Any File | Change File Name Online Instantly</title>
        <meta
          name="description"
          content="Rename any type of file online- PDF, Word, Excel, Image, PPT, or ZIP. Fast and free file renamer tool with drag & drop support."
        />
        <link rel="canonical" href="https://fileunivers.com/renamefile" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="rename file online, change file name, file renamer, rename pdf, rename word, rename image, rename pptx, rename docx, rename csv"/>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <ScrollToTop />
      <div className="pagetitle">
        <h1>Rename Files Online - Free Fast and Secure  Rename Your File Instantly </h1>
        <p className="intro-paragraph">
          Easily rename multiple files online in seconds using this free and secure file renaming tool. Whether you want to rename images, documents, videos, or any file type, this tool lets you change filenames in bulk- no downloads or installations needed. Simply upload your files, set your naming pattern or prefix, and download the renamed files instantly.
        </p>
      </div>

      <div
        className="compressor-container "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="compressing">
          <h2 color="black">Rename Your File</h2>
        </div>
        <p
          className="file-label clickable-label"
          onClick={() => fileInputRef.current.click()}
        >
          {file ? `✅ Selected: ${file.name}` : "   📂 Drag & drop any file here, or click to select"}
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden-input"
        />

        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={["*"]} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={["*"]} />
        </div>

        <div className="rename-section" style={{margin:'10px'}}>
          <input style={{padding:'10px',paddingLeft:"40px",paddingRight:"40px",width:'300px',margin:"30px",borderRadius:"8px"}}
            type="text"
            className="rename-input"
            placeholder="Enter name without extension"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <button onClick={handleRename} disabled={!file || status === "renaming"}>
          {status === "renaming" ? "Renaming..." : "Rename & Download"}
        </button>

        {status === "done" && <p className="success-msg">✅ File renamed and downloaded!</p>}
      </div>

      <section>
  <div className="compressor-page">
    <h2 className="compressor-heading">Rename Any File Online</h2>
    <p className="compressor-description">
      Instantly rename any file- PDF, Word, Excel, Image, ZIP, or more- directly in your browser.
      No upload, no registration, and no privacy risk. Simply change the file name and download it instantly.Our online file renamer is designed for speed, accuracy, and convenience. You can organize large file collections effortlessly, maintain consistent naming for projects, or prepare files for upload. Perfect for photographers, students, professionals, and anyone managing lots of files. Simplify your workflow with fileunivers.com, the easiest and fastest way to rename files online for free.
    </p>
    <div className="converterImg">
            <div >
              <img src="rename.png" alt="rename Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>RE-NAME</p>
            </div>
          </div>

    <h2 className="compressor-subheading">How to Rename a File?</h2>
    <ol className="compressor-steps">
      <li>   📂 Upload or drag & drop your file</li>
      <li>    Enter the new file name (without changing the extension)</li>
      <li>🚀 Click <strong>Rename & Download</strong></li>
      <li>   ⬇️ Instantly get your file with the new name</li>
    </ol>
    <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Re-name yours Files ? "
              description='Rename all your files in seconds!. This video shows how to rename files online quickly and easily,no software required. In this video, you’ll learn: How to upload and rename multiple files at once Add prefixes, suffixes, or numbering automatically Download all renamed files instantly .'
            />
          </section>

    <h2 className="compressor-subheading">Why Use Our Rename Tool?</h2>
    <ul className="compressor-benefits">
      <li>     Works with all file types- PDF, DOCX, PPTX, XLSX, JPG, PNG, ZIP, and more</li>
      <li>⚡ Rename instantly without uploading to a server</li>
      <li>🔒100% safe- files never leave your device</li>
      <li>🌐 Works on any browser or device</li>

      <h2 style={{ marginBottom: "6px" }}>Also check other features related to PDF and File Tools</h2>
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
  </div>

  <section>
    <div className="compressor-article">
      <h2>Everything You Need to Know About Renaming Files</h2>

      <h3>📄 What Does File Renaming Mean?</h3>
      <p>
        File renaming means changing the name of your file without altering its contents or format. 
        For example, changing <code>Document(1).pdf</code> to <code>Invoice_January2025.pdf</code> 
        helps you stay organized, identify files quickly, and share them professionally.
      </p>

      <h3>   📦 Why You Might Need to Rename Files</h3>
      <p>
        File names can become cluttered, confusing, or inconsistent over time. Whether it’s a photo, 
        report, or spreadsheet, renaming helps create order. Students, professionals, and businesses 
        often rename files to meet submission guidelines, project standards, or for simple clarity.
      </p>

      <h3>💡 Benefits of Using Our Rename Tool</h3>
      <ul>
        <li><strong>⚡ Instant Action</strong> - Rename and download immediately, no waiting or uploading</li>
        <li><strong>🔐 Complete Privacy</strong> - The process happens in your browser only</li>
        <li><strong>📁 Universal Compatibility</strong> - Works with PDFs, Word, Excel, images, archives, and more</li>
        <li><strong>🧠   Better Organization</strong> - Manage and identify your files easily</li>
        <li><strong>   💾¼ Professional Look</strong> - Send neatly named documents for work or clients</li>
      </ul>

      <h3>   🛠️ How This Rename Tool Works</h3>
      <p>
        Our Rename File tool runs entirely in your browser using JavaScript. Once you select a file and 
        type your new name, the tool creates a renamed copy with the same extension (like <code>.pdf</code> or <code>.jpg</code>). 
        You can then download it instantly- no upload or conversion needed.
      </p>
      <ol>
        <li>    Select or drop your file</li>
        <li>    Type your preferred file name</li>
        <li>    Click the rename button</li>
        <li>    Download your file instantly with the new name</li>
      </ol>

      <h3>🔒Is It Safe to Rename Files Online?</h3>
      <p>
        Yes, it’s 100% safe. Unlike many online tools that upload files to a server, our renaming tool 
        performs all actions locally on your device. That means your files never leave your computer 
        and remain private at all times.
      </p>
      <ul>
        <li>🔒No server upload</li>
        <li>     Fully local processing</li>
        <li>   ♻️ No data stored or shared</li>
      </ul>

      <h3>🌍 Supported File Types</h3>
      <p>
        You can rename nearly every type of file, including:
      </p>
      <ul>
        <li>📄 Documents - PDF, DOC, DOCX, ODT, TXT, RTF</li>
        <li>📚 Spreadsheets - XLS, XLSX, CSV, ODS</li>
        <li>     Presentations - PPT, PPTX, ODP</li>
        <li>     Images - JPG, PNG, TIFF, BMP, WEBP</li>
        <li>   📦 Archives - ZIP, 7Z, RAR</li>
        <li>    Media - MP3, MP4, MOV, and more</li>
      </ul>

      <h3>💡 Tips for Naming Files</h3>
      <p>
        Good file naming makes your files easier to find and manage. Try these tips:
      </p>
      <ul>
        <li>✅ Use underscores or hyphens instead of spaces (e.g., <code>project_report_2025.pdf</code>)</li>
        <li>✅ Include version numbers or dates (<code>invoice_31Oct2025.pdf</code>)</li>
        <li>✅ Avoid special symbols like <code>?</code> or <code>/</code></li>
        <li>✅ Keep names short but meaningful</li>
      </ul>

      <h3>🚀 Why Choose FileUnivers?</h3>
      <p>
        FileUnivers offers a full suite of free, secure, and easy-to-use file tools. Whether you want to 
        convert, compress, or rename, everything happens directly in your browser without installation 
        or login. The Rename File tool is designed for speed, simplicity, and complete privacy.
      </p>

      <h3>   🔚 Final Thoughts</h3>
      <p>
        Renaming files might sound like a small thing, but it can make a big difference in how you manage 
        and share your data. Use our <strong>Rename Any File</strong> tool to stay organized, work faster, 
        and keep your files labeled clearly- all for free, right here on FileUnivers.
      </p>
    </div>
  </section>
</section>

    </>
  );
};

export default RenameFile;
