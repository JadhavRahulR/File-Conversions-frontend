// src/components/Sidebar.js
import { Link } from 'react-router-dom';
import "./sidebar.css"
const Sidebar = (props) => {

  const check = () =>{
      alert("you just clicked")
  }
  return (
    <div className="">
      <h2 className="">File Converter</h2>
      <ul className="">
        <li onClick={check}><Link to="/word-to-pdf" className='btn'>Word to PDF Converter {props.name1} </Link></li>
        <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
        <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
        <li><Link to="/odt-to-pdf" className='btn'>odt to pdf Converter </Link></li>
        <li><Link to="/text-to-pdf" className='btn'>txt to pdf Converter </Link></li>
        <li><Link to="/doc-to-odt" className='btn'>doc to odt Converter </Link></li>
        <li><Link to="/odt-to-doc" className='btn'> odt to doc  Converter </Link></li>
        <li><Link to="/pptx-to-pdf" className='btn'> pptx to pdf  Converter </Link></li>
        <li><Link to="/pptx-to-odp" className='btn'> pptx to odp  Converter </Link></li>
        <li><Link to="/odp-to-pptx" className='btn'> odp to pptx  Converter </Link></li>
        <li><Link to="/rtf-to-pdf" className='btn'> rtf to pdf Converter </Link></li>
        <li><Link to="/html-to-pdf" className='btn'> html to pdf Converter </Link></li>
        <li><Link to="/md-to-pdf" className='btn'> md  to pdf Converter </Link></li>
        <li><Link to="/xlsx-to-pdf" className='btn'> xlsx  to pdf Converter </Link></li>
        <li><Link to="/csv-to-pdf" className='btn'> csv to pdf Converter </Link></li>
        <li><Link to="/img-to-pdf" className='btn'> img to pdf Converter </Link></li>
        <li><Link to="/tiff-to-pdf" className='btn'> tiff to pdf Converter </Link></li>


      </ul>
    </div>
  );
};

export default Sidebar;
