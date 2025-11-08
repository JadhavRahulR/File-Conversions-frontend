import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom'
import "./sidebar.css"
import { Helmet } from 'react-helmet-async';

function Tools(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Helmet>
        <title>Convert & Compress Files Online | FileUnivers Tools</title>
        <meta name="description" content="Access all-in-one file tools at FileUnivers — convert PDFs, Word, Excel, PowerPoint, images and compress them efficiently. Free, secure, and fast." />
        <meta name="keywords" content="file converter, file compression, compress pdf, pdf to word, word to pdf, image to pdf, compress docx, compress pptx, merge pdf, convert files, online converter, file tools" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fileunivers.in/tools" />
        {/* <meta property="og:title" content="Convert & Compress Files Online | FileUnivers Tools" />
        <meta property="og:description" content="Use our complete toolset to convert and compress PDFs, DOCX, PPTX, Excel, images, and more in one place. Fast, free, and user-friendly." />
        <meta property="og:url" content="https://fileunivers.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FileUnivers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Convert & Compress Files Online | FileUnivers Tools" />
        <meta name="twitter:description" content="All your file conversion and compression tools in one place. Start converting and compressing now." /> */}

      </Helmet>
      <Button variant="primary" onClick={handleShow} className='m-2' style={{ border: 'none' }}>
        F I L E S-C O N V E R S I O N S
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ width: '150px ', border: '1px solid grey', borderRadius: "10px", textAlign: "center" }}>T o o l s  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='sidebarbody'>
          <ul>

            <li><Link to="/word-to-pdf" className='btn' onClick={handleClose}>WORD To PDF Converter </Link></li>
            <li><Link to="/pdf-to-word" className='btn' onClick={handleClose}>PDF To WORD Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' onClick={handleClose}>ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' onClick={handleClose}>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' onClick={handleClose}>TEXT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-txt" className='btn' onClick={handleClose}>PDF To TEXT Converter </Link></li>
            <li><Link to="/doc-to-odt" className='btn' onClick={handleClose}>DOC To ODT Converter </Link></li>
            <li><Link to="/odt-to-doc" className='btn' onClick={handleClose}> ODT To DOC  Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' onClick={handleClose}> PPTX To PDF  Converter </Link></li>
            <li><Link to="/pptx-to-odp" className='btn' onClick={handleClose}> PPTX To ODP  Converter </Link></li>
            <li><Link to="/odp-to-pptx" className='btn' onClick={handleClose}> ODP To PPTX  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' onClick={handleClose}> RTF To PDF Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' onClick={handleClose}> HTML To PDF Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' onClick={handleClose}> MD To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' onClick={handleClose}> XLSX  To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' onClick={handleClose}> CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' onClick={handleClose}> IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' onClick={handleClose}> TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' onClick={handleClose}> PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' onClick={handleClose}> PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' onClick={handleClose}> PDF To RTF Converter </Link></li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Tools;