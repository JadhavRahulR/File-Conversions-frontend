import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom'
import "./sidebar.css"

function Tools(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='m-2'>
       F I L E S-C O N V E R S I O N S  
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{width:'150px ', border:'1px solid grey',borderRadius:"10px",textAlign:"center"}}>T o o l s  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        {/* <Sidebar/> */}
        <ul>

         <li><Link to="/word-to-pdf" className='btn' onClick={handleClose}>Word to PDF Converter </Link></li>
        <li><Link to="/pdf-to-word" className='btn'onClick={handleClose}>PDF to Word Converter </Link></li>
        <li><Link to="/odt-to-pdf" className='btn'onClick={handleClose}>odt to pdf Converter </Link></li>
        <li><Link to="/text-to-pdf" className='btn'onClick={handleClose}>txt to pdf Converter </Link></li>
        <li><Link to="/doc-to-odt" className='btn'onClick={handleClose}>doc to odt Converter </Link></li>
        <li><Link to="/odt-to-doc" className='btn'onClick={handleClose}> odt to doc  Converter </Link></li>
        <li><Link to="/pptx-to-pdf" className='btn'onClick={handleClose}> pptx to pdf  Converter </Link></li>
        <li><Link to="/pptx-to-odp" className='btn'onClick={handleClose}> pptx to odp  Converter </Link></li>
        <li><Link to="/odp-to-pptx" className='btn'onClick={handleClose}> odp to pptx  Converter </Link></li>
        <li><Link to="/rtf-to-pdf" className='btn'onClick={handleClose}> rtf to pdf Converter </Link></li>
        <li><Link to="/html-to-pdf" className='btn'onClick={handleClose}> html to pdf Converter </Link></li>
        <li><Link to="/md-to-pdf" className='btn'onClick={handleClose}> md  to pdf Converter </Link></li>
        <li><Link to="/xlsx-to-pdf" className='btn'onClick={handleClose}> xlsx  to pdf Converter </Link></li>
        <li><Link to="/csv-to-pdf" className='btn'onClick={handleClose}> csv to pdf Converter </Link></li>
        <li><Link to="/img-to-pdf" className='btn'onClick={handleClose}> img to pdf Converter </Link></li>
        <li><Link to="/tiff-to-pdf" className='btn'onClick={handleClose}> tiff to pdf Converter </Link></li>
        <li><Link to="/pdf-to-odt" className='btn'onClick={handleClose}> pdf to odt Converter </Link></li>
        <li><Link to="/pdf-to-txt" className='btn'onClick={handleClose}> pdf to txt Converter </Link></li>
        <li><Link to="/pdf-to-pptx" className='btn'onClick={handleClose}> pdf to pptx Converter </Link></li>
        <li><Link to="/pdf-to-rtf"  className='btn'onClick={handleClose}> pdf to rtf Converter </Link></li>
        </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Tools;