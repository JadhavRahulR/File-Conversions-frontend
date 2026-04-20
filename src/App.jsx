// // import Fille from './FileConverter';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CsvToPdfConverter from "./CsvToPdfConverter";
// import DocToOdtConverter from "./DocToOdtConverter";
// import HtmlToPdfConverter from "./HtmlToPdfConverter";
// import ImageToPdfConverter from "./ImageToPdfConverter";
// import MdToPdfConverter from "./MdToPdfConverter";
// import OdpToPptx from "./OdpToPptx";
// import OdtToDocConverter from "./OdtToDocConverter";
// import OdtToPdfConverter from "./OdtToPdfConverter";
// import PdfToWordConverter from "./PdfToWordConverter";
// import PptxToOdp from "./PptxToOdp";
// import PptxToPdf from "./PptxToPdf";
// import RtfToPdfConverter from "./RtfToPdfConverter";
// import TiffToPdfConverter from "./TiffToPdfConverter";
// import TxtToPdfConverter from "./TxtToPdfConverter";
// import WordToPdfConverter from "./WordToPdfConverter";
// import XlsxToPdfConverter from "./XlsxToPdfConverter";
// import Navbar1 from './Navbar';
// import About from './About';
// import ToolsPg from './ToolsPg';
// import LandingPage from './LandingPg';
// import PDFCompressor from './PDFCompressor';
// import PdfToOdtConverter from './PDFtoODT';
// import PdfToTextConverter from './PdfToTextConverter';
// import PdfToPptxConverter from './PdfToPptxConverter';
// import PdfToRtfConverter from './PdfToRtfConverter';
// import ImageCompressor from './ImageCompressor';
// import PDFMerger from './PDFMerger';
// import ZipCompressor from './ZipCompressor';
// import ZipExtractor from './ZipExtractor';
// import PrivacyPolicy from './PrivacyPolicy';
// import TermsAndConditions from './TermsAndConditions';
// import ContactUs from './ContactUs';
// import CsvCompressor from './CsvCompressor';
// import PptxCompressor from './PptxCompressor';
// import DocxCompressor from './DocxCompressor';
// import XlsxCompressor from './XlsxCompressor';
// import OdtCompressor from './OdtCompressor';
// import OdpCompressor from './OdpCompressor';
// import TiffCompressor from './TiffCompressor';
// import BmpCompressor from './BmpCompressor';
// import FaviconGenerator from './FaviconGenerator';
// import RenameFile from './RenameFile';
// import Footer from './Footer';
// import GlobalLoader from './GlobalLoader';
// import { PdfPageRemove } from './PdfPageRemove';
// import { PdfPageExtractor } from './PdfPageExtractor';
// import "./App.css"
// import ImageResizerPage from './ImageResizerPage';
// import PngToJpgPage from './PngToJpgPage';
// import PngToWebpPage from './PngToWebpPage';
// import PngToAvifPage from './PngToAvifPage';
// import JpgToPngPage from './JpgToPngPage';
// import WebpToPngPage from './WebpToPngPage';
// import WebpToJpgPage from './WebpToJpgPage';
// import JpgToWebpPage from './JpgToWebpPage';
// import AvifToPngPage from './AvifToPngPage';
// import { Helmet } from 'react-helmet-async';
// import PdfUrlPage from './PdfUrlPage';
// import PdfUrlToPdf from './PdfUrlToPdf';
// import WebpageToPdf from './WebpageToPdf';
// import TTS from './TTS';


// function App() {
//   return (
//     <div className="app-container">

//       <Navbar1 />
      
//       <div className="main-content">
//         <GlobalLoader />
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/aboutus" element={<About />} />
//           <Route path="/tools" element={<ToolsPg />} />
//           <Route path="/word-to-pdf" element={<WordToPdfConverter />} />
//           <Route path="/pdf-to-word" element={<PdfToWordConverter />} />
//           <Route path="/odt-to-pdf" element={<OdtToPdfConverter />} />
//           <Route path="/text-to-pdf" element={<TxtToPdfConverter />} />
//           <Route path="/doc-to-odt" element={<DocToOdtConverter />} />
//           <Route path="/odt-to-doc" element={<OdtToDocConverter />} />
//           <Route path="/pptx-to-pdf" element={<PptxToPdf />} />
//           <Route path="/pptx-to-odp" element={<PptxToOdp />} />
//           <Route path="/odp-to-pptx" element={<OdpToPptx />} />
//           <Route path="/rtf-to-pdf" element={<RtfToPdfConverter />} />
//           <Route path="/html-to-pdf" element={<HtmlToPdfConverter />} />
//           <Route path="/md-to-pdf" element={<MdToPdfConverter />} />
//           <Route path="/xlsx-to-pdf" element={<XlsxToPdfConverter />} />
//           <Route path="/csv-to-pdf" element={<CsvToPdfConverter />} />
//           <Route path="/img-to-pdf" element={<ImageToPdfConverter />} />
//           <Route path="/tiff-to-pdf" element={<TiffToPdfConverter />} />
//           <Route path="/pdf-to-odt" element={<PdfToOdtConverter />} />
//           <Route path="/pdf-to-txt" element={<PdfToTextConverter />} />
//           <Route path="/pdf-to-pptx" element={<PdfToPptxConverter />} />
//           <Route path="/pdf-to-rtf" element={<PdfToRtfConverter />} />
//           <Route path="/pdf-compressor" element={<PDFCompressor />} />
//           <Route path="/merge-pdf" element={<PDFMerger />} />
//           <Route path="/img-compressor" element={<ImageCompressor />} />
//           <Route path="/zip-compressor" element={<ZipCompressor />} />
//           <Route path="/zip-extractor" element={<ZipExtractor />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms" element={<TermsAndConditions />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/csvcompress" element={<CsvCompressor />} />
//           <Route path="/pptxcompress" element={<PptxCompressor />} />
//           <Route path="/docxcompressor" element={<DocxCompressor />} />
//           <Route path="/xlsxcompressor" element={<XlsxCompressor />} />
//           <Route path="/odtcompressor" element={<OdtCompressor />} />
//           <Route path="/odpcompressor" element={<OdpCompressor />} />
//           <Route path="/tiffcompressor" element={<TiffCompressor />} />
//           <Route path="/bmpcompressor" element={<BmpCompressor />} />
//           <Route path="/favicon-generator" element={<FaviconGenerator />} />
//           <Route path="/renamefile" element={<RenameFile />} />
          
//           <Route path='pdfextractor' element={<PdfPageExtractor />} />
//           <Route path='pdfpageremover' element={<PdfPageRemove />} />
//           <Route path='imageresizer' element={<ImageResizerPage/>}/>
//           <Route path='pngtojpg' element={<PngToJpgPage/>}/>
//           <Route path='pngtowebp' element={<PngToWebpPage/>}/>
//           <Route path='pngtoavif' element={<PngToAvifPage/>}/>
//           <Route path='aviftopng' element={<AvifToPngPage/>}/>
//           <Route path='jpgtopng' element={<JpgToPngPage/>}/>
//           <Route path='webptopng' element={<WebpToPngPage/>}/>
//           <Route path='webptojpg' element={<WebpToJpgPage/>}/>
//           <Route path='jpgtowebp' element={<JpgToWebpPage/>}/>



//           {/* <Route path="/pdfurl" element={<PdfUrlPage />} />
//           <Route path="/urlpdf" element={<PdfUrlToPdf />} />
//           <Route path="/webpagetopdf" element={<WebpageToPdf />} />
//           <Route path='tts' element={<TTS/>} /> */}

//           {/* Above line is keep stop to due server load */}

//           <></>
//         </Routes>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar1 from "./Navbar";
import Footer from "./Footer";
import GlobalLoader from "./GlobalLoader";
import "./App.css";

// ✅ Lazy load ALL pages
const LandingPage = lazy(() => import("./LandingPg"));
const About = lazy(() => import("./About"));
const ToolsPg = lazy(() => import("./ToolsPg"));

const WordToPdfConverter = lazy(() => import("./WordToPdfConverter"));
const PdfToWordConverter = lazy(() => import("./PdfToWordConverter"));
const OdtToPdfConverter = lazy(() => import("./OdtToPdfConverter"));
const TxtToPdfConverter = lazy(() => import("./TxtToPdfConverter"));
const DocToOdtConverter = lazy(() => import("./DocToOdtConverter"));
const OdtToDocConverter = lazy(() => import("./OdtToDocConverter"));
const PptxToPdf = lazy(() => import("./PptxToPdf"));
const PptxToOdp = lazy(() => import("./PptxToOdp"));
const OdpToPptx = lazy(() => import("./OdpToPptx"));
const RtfToPdfConverter = lazy(() => import("./RtfToPdfConverter"));
const HtmlToPdfConverter = lazy(() => import("./HtmlToPdfConverter"));
const MdToPdfConverter = lazy(() => import("./MdToPdfConverter"));
const XlsxToPdfConverter = lazy(() => import("./XlsxToPdfConverter"));
const CsvToPdfConverter = lazy(() => import("./CsvToPdfConverter"));
const ImageToPdfConverter = lazy(() => import("./ImageToPdfConverter"));
const TiffToPdfConverter = lazy(() => import("./TiffToPdfConverter"));

const PdfToOdtConverter = lazy(() => import("./PDFtoODT"));
const PdfToTextConverter = lazy(() => import("./PdfToTextConverter"));
const PdfToPptxConverter = lazy(() => import("./PdfToPptxConverter"));
const PdfToRtfConverter = lazy(() => import("./PdfToRtfConverter"));

const PDFCompressor = lazy(() => import("./PDFCompressor"));
const PDFMerger = lazy(() => import("./PDFMerger"));
const ImageCompressor = lazy(() => import("./ImageCompressor"));
const ZipCompressor = lazy(() => import("./ZipCompressor"));
const ZipExtractor = lazy(() => import("./ZipExtractor"));

const CsvCompressor = lazy(() => import("./CsvCompressor"));
const PptxCompressor = lazy(() => import("./PptxCompressor"));
const DocxCompressor = lazy(() => import("./DocxCompressor"));
const XlsxCompressor = lazy(() => import("./XlsxCompressor"));
const OdtCompressor = lazy(() => import("./OdtCompressor"));
const OdpCompressor = lazy(() => import("./OdpCompressor"));
const TiffCompressor = lazy(() => import("./TiffCompressor"));
const BmpCompressor = lazy(() => import("./BmpCompressor"));

const FaviconGenerator = lazy(() => import("./FaviconGenerator"));
const RenameFile = lazy(() => import("./RenameFile"));

const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./TermsAndConditions"));
const ContactUs = lazy(() => import("./ContactUs"));

const PdfPageExtractor = lazy(() => import("./PdfPageExtractor"));
const PdfPageRemove = lazy(() => import("./PdfPageRemove"));

const ImageResizerPage = lazy(() => import("./ImageResizerPage"));
const PngToJpgPage = lazy(() => import("./PngToJpgPage"));
const PngToWebpPage = lazy(() => import("./PngToWebpPage"));
const PngToAvifPage = lazy(() => import("./PngToAvifPage"));
const JpgToPngPage = lazy(() => import("./JpgToPngPage"));
const WebpToPngPage = lazy(() => import("./WebpToPngPage"));
const WebpToJpgPage = lazy(() => import("./WebpToJpgPage"));
const JpgToWebpPage = lazy(() => import("./JpgToWebpPage"));
const AvifToPngPage = lazy(() => import("./AvifToPngPage"));

function App() {
  return (
    <div className="app-container">
      <Navbar1 />

      <div className="main-content">
        <GlobalLoader />

        {/* ✅ Suspense wrapper */}
        <Suspense fallback={<div style={{textAlign:"center", padding:"50px"}}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/tools" element={<ToolsPg />} />

            <Route path="/word-to-pdf" element={<WordToPdfConverter />} />
            <Route path="/pdf-to-word" element={<PdfToWordConverter />} />
            <Route path="/odt-to-pdf" element={<OdtToPdfConverter />} />
            <Route path="/text-to-pdf" element={<TxtToPdfConverter />} />
            <Route path="/doc-to-odt" element={<DocToOdtConverter />} />
            <Route path="/odt-to-doc" element={<OdtToDocConverter />} />

            <Route path="/pptx-to-pdf" element={<PptxToPdf />} />
            <Route path="/pptx-to-odp" element={<PptxToOdp />} />
            <Route path="/odp-to-pptx" element={<OdpToPptx />} />

            <Route path="/rtf-to-pdf" element={<RtfToPdfConverter />} />
            <Route path="/html-to-pdf" element={<HtmlToPdfConverter />} />
            <Route path="/md-to-pdf" element={<MdToPdfConverter />} />

            <Route path="/xlsx-to-pdf" element={<XlsxToPdfConverter />} />
            <Route path="/csv-to-pdf" element={<CsvToPdfConverter />} />
            <Route path="/img-to-pdf" element={<ImageToPdfConverter />} />
            <Route path="/tiff-to-pdf" element={<TiffToPdfConverter />} />

            <Route path="/pdf-to-odt" element={<PdfToOdtConverter />} />
            <Route path="/pdf-to-txt" element={<PdfToTextConverter />} />
            <Route path="/pdf-to-pptx" element={<PdfToPptxConverter />} />
            <Route path="/pdf-to-rtf" element={<PdfToRtfConverter />} />

            <Route path="/pdf-compressor" element={<PDFCompressor />} />
            <Route path="/merge-pdf" element={<PDFMerger />} />
            <Route path="/img-compressor" element={<ImageCompressor />} />
            <Route path="/zip-compressor" element={<ZipCompressor />} />
            <Route path="/zip-extractor" element={<ZipExtractor />} />

            <Route path="/csvcompress" element={<CsvCompressor />} />
            <Route path="/pptxcompress" element={<PptxCompressor />} />
            <Route path="/docxcompressor" element={<DocxCompressor />} />
            <Route path="/xlsxcompressor" element={<XlsxCompressor />} />
            <Route path="/odtcompressor" element={<OdtCompressor />} />
            <Route path="/odpcompressor" element={<OdpCompressor />} />
            <Route path="/tiffcompressor" element={<TiffCompressor />} />
            <Route path="/bmpcompressor" element={<BmpCompressor />} />

            <Route path="/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/renamefile" element={<RenameFile />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route path="/pdfextractor" element={<PdfPageExtractor />} />
            <Route path="/pdfpageremover" element={<PdfPageRemove />} />

            <Route path="/imageresizer" element={<ImageResizerPage />} />
            <Route path="/pngtojpg" element={<PngToJpgPage />} />
            <Route path="/pngtowebp" element={<PngToWebpPage />} />
            <Route path="/pngtoavif" element={<PngToAvifPage />} />
            <Route path="/aviftopng" element={<AvifToPngPage />} />
            <Route path="/jpgtopng" element={<JpgToPngPage />} />
            <Route path="/webptopng" element={<WebpToPngPage />} />
            <Route path="/webptojpg" element={<WebpToJpgPage />} />
            <Route path="/jpgtowebp" element={<JpgToWebpPage />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default App;