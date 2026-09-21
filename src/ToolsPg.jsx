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
          <p>Compress XLSX </p>
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

        <Link to="/renamefile" ><div className="toolcard">
          <p>Change file name  </p>
        </div></Link>

        <Link to="/imageresizer" ><div className="toolcard">
          <p>Image Resizer  </p>
        </div></Link>
        <Link to="/pdfextractor" ><div className="toolcard">
          <p>Pdf Page Extractor  </p>
        </div></Link>

        <Link to="/pdfpageremover" ><div className="toolcard"> <p>Pdf Page Remover  </p> </div></Link>
        <Link to="/imageresizer" ><div className="toolcard"> <p>Image Resizer  </p> </div></Link>
        <Link to="/pngtojpg" ><div className="toolcard"> <p>PNG to JPG </p> </div></Link>
        <Link to="/pngtowebp" ><div className="toolcard"> <p>PNG to WEBP  </p> </div></Link>
        <Link to="/pngtoavif" ><div className="toolcard"> <p>PNG to AVIF  </p> </div></Link>
        <Link to="/aviftopng" ><div className="toolcard"> <p>AVIF to PNG </p> </div></Link>
        <Link to="/jpgtopng" ><div className="toolcard"> <p>JPG to PNG </p> </div></Link>
        <Link to="/webptopng" ><div className="toolcard"> <p>WEBP to PNG </p> </div></Link>
        <Link to="/webptojpg" ><div className="toolcard"> <p>WEBP to JPG  </p> </div></Link>
        <Link to="/jpgtowebp" ><div className="toolcard"> <p>JPG to WEBP  </p> </div></Link>
        <Link to="/mp3-joiner" ><div className="toolcard"> <p>MP3 Joiner </p> </div></Link>
        <Link to="/video-to-gif" ><div className="toolcard"> <p>Video to GIF  </p> </div></Link>
        <Link to="/bulk-renamer" ><div className="toolcard"> <p>Bulk Re-namer  </p> </div></Link>
        <Link to="/ringtone-maker" ><div className="toolcard"> <p>Ringtone Maker </p> </div></Link>
        {/* <Link to="/invoice-generator" ><div className="toolcard"> <p>Invoice Generator </p> </div></Link> */}


         


      </div>
    </div>
  )
}

export default ToolsPg