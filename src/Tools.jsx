
import { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { Helmet } from "react-helmet-async";

function Tools() {
    const [show, setShow] = useState(false);
    const [closing, setClosing] = useState(false);

    const handleShow = () => {
        setClosing(false);
        setShow(true);
    };

    const handleClose = () => {
        setClosing(true);
    };

    const handleAnimationEnd = () => {
        if (closing) {
            setShow(false);
            setClosing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>online file converting and compressing Tools</title>

                <meta
                    name="description"
                    content="Free online file converter & compressor. Convert PDF, Word, Excel, images & more in seconds with FileUnivers – fast, secure & easy-to-use tools."
                />

                <meta
                    name="keywords"
                    content="file converter, file compression, compress pdf, pdf to word, word to pdf, image to pdf, compress docx, compress pptx, merge pdf, convert files, online converter, file tools"
                />

                <meta
                    name="robots"
                    content="index, follow"
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/tools"
                />
            </Helmet>

            <button
                type="button"
                className="tools-open-button"
                onClick={handleShow}
            >
                F I L E S-C O N V E R S I O N S
            </button>

            {show && (
                <>
                    <div
                        className={`tools-overlay ${
                            closing ? "tools-closing" : ""
                        }`}
                        onClick={handleClose}
                    />

                    <aside
                        className={`tools-offcanvas ${
                            closing ? "tools-closing" : ""
                        }`}
                        onAnimationEnd={handleAnimationEnd}
                    >
                        <div className="tools-header">
                            <h2>Tools</h2>

                            <button
                                type="button"
                                className="tools-close-button"
                                onClick={handleClose}
                                aria-label="Close tools"
                            >
                                ×
                            </button>
                        </div>

                        <div className="sidebarbody">
                            <ul>
                                <li>
                                    <Link
                                        to="/word-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        WORD To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pdf-to-word"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PDF To WORD Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/odt-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        ODT To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pdf-to-odt"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PDF To ODT Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/text-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        TEXT To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pdf-to-txt"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PDF To TEXT Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/doc-to-odt"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        DOC To ODT Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/odt-to-doc"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        ODT To DOC Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pptx-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PPTX To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pptx-to-odp"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PPTX To ODP Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/odp-to-pptx"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        ODP To PPTX Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/rtf-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        RTF To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/html-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        HTML To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/md-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        MD To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/xlsx-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        XLSX To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/csv-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        CSV To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/img-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        IMG To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/tiff-to-pdf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        TIFF To PDF Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pdf-to-pptx"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PDF To PPTX Converter
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/pdf-to-rtf"
                                        className="btn"
                                        onClick={handleClose}
                                    >
                                        PDF To RTF Converter
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}

export default Tools;
