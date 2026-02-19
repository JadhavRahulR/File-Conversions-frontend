// import Fille from './FileConverter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CsvToPdfConverter from "./CsvToPdfConverter";
import DocToOdtConverter from "./DocToOdtConverter";
import HtmlToPdfConverter from "./HtmlToPdfConverter";
import ImageToPdfConverter from "./ImageToPdfConverter";
import MdToPdfConverter from "./MdToPdfConverter";
import OdpToPptx from "./OdpToPptx";
import OdtToDocConverter from "./OdtToDocConverter";
import OdtToPdfConverter from "./OdtToPdfConverter";
import PdfToWordConverter from "./PdfToWordConverter";
import PptxToOdp from "./PptxToOdp";
import PptxToPdf from "./PptxToPdf";
import RtfToPdfConverter from "./RtfToPdfConverter";
import TiffToPdfConverter from "./TiffToPdfConverter";
import TxtToPdfConverter from "./TxtToPdfConverter";
import WordToPdfConverter from "./WordToPdfConverter";
import XlsxToPdfConverter from "./XlsxToPdfConverter";
import Navbar1 from './Navbar';
import About from './About';
import ToolsPg from './ToolsPg';
import LandingPage from './LandingPg';
import PDFCompressor from './PDFCompressor';
import PdfToOdtConverter from './PDFtoODT';
import PdfToTextConverter from './PdfToTextConverter';
import PdfToPptxConverter from './PdfToPptxConverter';
import PdfToRtfConverter from './PdfToRtfConverter';
import ImageCompressor from './ImageCompressor';
import PDFMerger from './PDFMerger';
import ZipCompressor from './ZipCompressor';
import ZipExtractor from './ZipExtractor';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import ContactUs from './ContactUs';
import CsvCompressor from './CsvCompressor';
import PptxCompressor from './PptxCompressor';
import DocxCompressor from './DocxCompressor';
import XlsxCompressor from './XlsxCompressor';
import OdtCompressor from './OdtCompressor';
import OdpCompressor from './OdpCompressor';
import TiffCompressor from './TiffCompressor';
import BmpCompressor from './BmpCompressor';
import FaviconGenerator from './FaviconGenerator';
import { Helmet } from 'react-helmet-async';
import RenameFile from './RenameFile';
import Footer from './Footer';
import "./App.css"
import PdfUrlPage from './PdfUrlPage';
import GlobalLoader from './GlobalLoader';
import PdfUrlToPdf from './PdfUrlToPdf';
import WebpageToPdf from './WebpageToPdf';
import { PdfPageExtractor } from './PdfPageExtractor';
import { PdfPageRemove } from './PdfPageRemove';
import TTS from './TTS';
import ImageResizerPage from './ImageResizerPage';


function App() {
  return (
    <div className="app-container">

      <Navbar1 />
      {/* <Helmet>
      <title>F I L E -U N I V E R S </title>
      <meta name='description' content='this is online converter app that convert pdf , word , pptx ,etc files to other format '/>
      <link rel="canonical" href="https://fileunivers.com" />
      </Helmet> */}
      <div className="main-content">
        <GlobalLoader />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs />} />
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
          {/* <Route path="/pdfurl" element={<PdfUrlPage />} />
          <Route path="/urlpdf" element={<PdfUrlToPdf />} />
          <Route path="/webpagetopdf" element={<WebpageToPdf />} />
          <Route path='tts' element={<TTS/>} /> */}
          <Route path='pdfextractor' element={<PdfPageExtractor />} />
          <Route path='pdfpageremover' element={<PdfPageRemove />} />
          <Route path='imageresizer' element={<ImageResizerPage/>}/>

          {/* Above line is keep stop to due server load */}

          <></>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;