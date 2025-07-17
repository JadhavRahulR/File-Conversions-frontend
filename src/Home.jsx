import React from 'react'
import { Link } from 'react-router-dom'
import "./home.css"
import Footer from './Footer';
function Home() {
  return (
    <div className='homeContainer'>
      <h1>File Conversions</h1>
      <div className="homePgcontainer">
        <li><Link to="/word-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>word </h2>
              <p>T O  . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/pdf-to-word"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pdf</h2>
              <p>T O . . . </p>
              <h2>word </h2>
            </div>
          </div>
        </Link></li>
      </div>
      {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/odt-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>odt</h2>
              <p>T O . . . </p>
              <h2>PDF </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/text-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>txt</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
      </div>
 {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/doc-to-odt"  >
          <div className="card">
            <div className="PgContainer">
              <h2>doc</h2>
              <p>T O . . . </p>
              <h2>odt </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/odt-to-doc"  >
          <div className="card">
            <div className="PgContainer">
              <h2>odt</h2>
              <p>T O . . . </p>
              <h2>doc </h2>
            </div>
          </div>
        </Link></li>
      </div>
       {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/pptx-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pptx</h2>
              <p>T O . . . </p>
              <h2>PDF </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/pptx-to-odp"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pptx</h2>
              <p>T O . . . </p>
              <h2>odp </h2>
            </div>
          </div>
        </Link></li>
      </div>
     {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/odp-to-pptx"  >
          <div className="card">
            <div className="PgContainer">
              <h2>odp</h2>
              <p>T O . . . </p>
              <h2>pptx </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/rtf-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>rtf</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
      </div>
       {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/html-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>html</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/md-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>md</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
      </div>
       {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/xlsx-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>xlsx</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/csv-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>csv</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
      </div>
       {/* for other two conversions */}
      <div className="homePgcontainer">
        <li><Link to="/img-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>img</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/tiff-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>tiff</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li>
      </div>
      <div className="homePgcontainer">
        <li><Link to="/pdf-to-odt"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pdf</h2>
              <p>T O . . . </p>
              <h2>odt </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/pdf-to-pptx"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pdf</h2>
              <p>T O . . . </p>
              <h2>pptx </h2>
            </div>
          </div>
        </Link></li>
      </div>
      <div className="homePgcontainer">
        <li><Link to="/pdf-to-rtf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pdf</h2>
              <p>T O . . . </p>
              <h2>rtf </h2>
            </div>
          </div>
        </Link></li>
        <li><Link to="/pdf-to-txt"  >
          <div className="card">
            <div className="PgContainer">
              <h2>pdf</h2>
              <p>T O . . . </p>
              <h2>txt </h2>
            </div>
          </div>
        </Link></li>
      </div>

      {/* for pdf compressor */}
      <h1>Compress PDF </h1>
      <div className="homePgcontainer">
        <li><Link to="/pdf-compressor"  >
          <div className="card">
            <div className="PgContainer">
              <h2>PDF </h2>
              <p> Compress . . . </p>
              <h2> </h2>
            </div>
          </div>
        </Link></li>
        {/* <li><Link to="/tiff-to-pdf"  >
          <div className="card">
            <div className="PgContainer">
              <h2>tiff</h2>
              <p>T O . . . </p>
              <h2>pdf </h2>
            </div>
          </div>
        </Link></li> */}
      </div>

      <section className="homepgsection">

      <h1>Benefits </h1>
      <span>
        ✅ Free & secure
      </span>
      <span>
        ✅ No signup needed
      </span>
      <span>
        ✅ Fast conversion
      </span>
      <span>
        ✅ Works on all devices
      </span>
      </section>
      <Footer />
    </div>
  )
}

export default Home;