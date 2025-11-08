import React from 'react'
import Tools from './Tools'
import "./toolpg.css"
import { Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import Footer from "./Footer";

function ToolsPg() {
  const checkfunction = () =>{
    alert("You just click me ")
  }
  return ( 
    <div>
      <ScrollToTop/>
       <Tools/>
      <div className="toolpgcontainer">
        
        <Link to='/pdf-compressor' ><div className="toolcard">
          <p>Compress Pdf </p>
        </div> </Link>
        
        <Link to="/img-compressor"> <div className="toolcard">
          <p>Compress Image </p>
        </div> </Link>

       <Link to= '/csvcompress'> <div className="toolcard">
          <p>Compress Csv </p>
        </div> </Link>

        <Link to="/pptxcompress"><div className="toolcard">
          <p>Compress Pptx </p>
        </div></Link>

        <Link to="/docxcompressor"> <div className="toolcard">
          <p>Compress Docx </p>
        </div></Link>

         <Link to="/xlsxcompressor"><div className="toolcard">
          <p>Compress Xsls </p>
        </div></Link>
        <Link to="/odtcompressor" ><div className="toolcard">
          <p>Compress Odt </p>
        </div>    </Link>     
        <Link to="/odpcompressor" > <div className="toolcard">
          <p>Compress Odp </p>
        </div></Link>
        <Link to="/tiffcompressor" ><div className="toolcard">
          <p>Compress Tiff </p>
        </div></Link> 

         <Link to="/bmpcompressor" ><div className="toolcard">
          <p>Compress Bpm </p>
        </div></Link>
        <Link to="/merge-pdf" > <div className="toolcard">
          <p>Merge Pdf </p>
        </div></Link>
        <Link to="/zip-compressor" > <div className="toolcard">
          <p>Convert to Zip </p>
        </div></Link>
         <Link to="/zip-extractor" ><div className="toolcard">
          <p>Extract Zip  </p>
        </div></Link>
        <Link to="/favicon-generator" ><div className="toolcard">
          <p>Favicon Generator  </p>
        </div></Link>
      </div>
    </div>
  )
}

export default ToolsPg