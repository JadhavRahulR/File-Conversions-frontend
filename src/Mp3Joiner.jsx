import { useState } from "react";
import MediaDropzoneInput from "./MediaDropzoneInput";
import './mp3joiner.css';
import DriveFileInput from "./DriveFileInput";
import DropboxFileInput from "./DropboxFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";
import DriveMediaInput from "./DriveMediaInput";
import DropboxMediaFileInput from "./DropboxMediaFileInput";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

export default function Mp3Joiner() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [status, setStatus] = useState("");
  const [mergedFile, setMergedFile] = useState(null);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(prev => [...prev, ...selectedFiles]);
    setMergedFile(null); 
    setDownloadUrl("");
  };

  const handleFilesAccepted = (acceptedFiles) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles,
    ]);

    setMergedFile(null); 

    setDownloadUrl("");
  };

  const mergeMp3 = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 MP3 files");
      return;
    }

    try {
      setLoading(true);

      setStatus("Loading FFmpeg package...");

      const ffmpegModule = await import("@ffmpeg/ffmpeg");
      const utilModule = await import("@ffmpeg/util");

      const FFmpeg = ffmpegModule.FFmpeg;
      const fetchFile = utilModule.fetchFile;


      const ffmpeg = new FFmpeg();


      setStatus("Loading FFmpeg core...");


      await ffmpeg.load();



      setStatus("Checking Audio Files...");

      for (let i = 0; i < files.length; i++) {
        setStatus(
          `Adding Audio ${i + 1} of ${files.length}...`
        );

        await ffmpeg.writeFile(
          `audio${i}.mp3`,
          await fetchFile(files[i])
        );
      }
      setStatus("Preparing Join List...");
      const concatList = files
        .map((_, i) => `file 'audio${i}.mp3'`)
        .join("\n");

      await ffmpeg.writeFile(
        "list.txt",
        new TextEncoder().encode(concatList)
      );

      setStatus("Joining audio files...");

      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "list.txt",
        "-c:a",
        "libmp3lame",
        "-q:a",
        "2",
        "merged.mp3",
      ]);

      setStatus("Generating Output...");
      const data = await ffmpeg.readFile("merged.mp3");

      const blob = new Blob(
        [data.buffer],
        { type: "audio/mpeg" }
      );

      const mergedMp3File = new File(
        [blob],
        "merged.mp3",
        { type: "audio/mpeg" }
      );

      setMergedFile(mergedMp3File);

      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);

      setStatus("Ready To Download");
    } catch (error) {
      console.error(error);
      setStatus("Error");
      alert(error.message || "Failed to merge MP3 files");
    } finally {
      setLoading(false);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;

    const updated = [...files];

    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];

    setFiles(updated);
    setMergedFile(null);
    
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;

    const updated = [...files];

    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];

    setFiles(updated);
    setMergedFile(null);
  };

  const removeFile = (index) => {
    const updated = files.filter(
      (_, i) => i !== index
    );

    setFiles(updated);
    setDownloadUrl("");
    setMergedFile(null);
    removeFile
  };

  return (


    <>

    <Helmet>
  <title>MP3 Joiner Online Free | Merge Multiple MP3 Files</title>

  <meta
    name="description"
    content="Merge multiple MP3 files into one audio file online for free. Combine songs, podcasts, voice recordings, and audio clips directly in your browser without installing software."
  />

  <link
    rel="canonical"
    href="https://fileunivers.com/mp3-joiner"
  />

  <meta name="robots" content="index, follow" />

  <meta
    name="keywords"
    content="mp3 joiner, merge mp3 files, combine mp3 files, mp3 merger, join audio files online, merge audio files, free mp3 joiner, online mp3 merger, combine songs, merge podcasts"
  />

  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  {/* Breadcrumb Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://fileunivers.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "MP3 Joiner",
          item: "https://fileunivers.com/mp3-joiner",
        },
      ],
    })}
  </script>

  {/* WebApplication Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "FileUnivers MP3 Joiner",
      url: "https://fileunivers.com/mp3-joiner",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    })}
  </script>

  {/* FAQ Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I merge MP3 files online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your MP3 files, arrange them in the desired order, and click merge. The tool will combine them into a single MP3 file for download.",
          },
        },
        {
          "@type": "Question",
          name: "Is the MP3 Joiner free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The MP3 Joiner is completely free and works directly in your browser.",
          },
        },
        {
          "@type": "Question",
          name: "Will merging reduce audio quality?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool is designed to preserve audio quality while combining MP3 files into one track.",
          },
        },
        {
          "@type": "Question",
          name: "Can I merge multiple MP3 files at once?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can upload and combine multiple MP3 files into a single audio file.",
          },
        },
        {
          "@type": "Question",
          name: "Does the MP3 Joiner work on mobile devices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The tool works on Android, iPhone, tablets, laptops, and desktop computers.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to install software to merge MP3 files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Everything works directly in your web browser without any installation.",
          },
        },
      ],
    })}
  </script>
</Helmet>

<ScrollToTop/>
    <div className="headingsection">
      <h1>MP3 Joiner – Merge Multiple MP3 Files Online for Free</h1>
      <p>Join multiple MP3 files into a single audio file online without installing any software. This free MP3 Joiner lets you merge songs, podcasts, voice recordings, audiobooks, and other MP3 files directly in your browser. Upload your files, arrange them in the desired order, and combine them into one high-quality MP3 in seconds. Fast, secure, and easy to use on Windows, Mac, Android, and iPhone.</p>
    </div>
    <div className="mp3-joiner-container">
      <h2 className="mp3-joiner-title">
        Merge Audio files
      </h2>

      <input
        type="file"
        accept=".mp3,audio/mpeg"
        multiple
        onChange={handleFiles}
        className="mp3-joiner-input"
        />

      <div className="filecontainer">

        <div className="fileuploadcontainer">

          <DriveMediaInput
            allowedTypes={[".mp3"]}
            onFilePicked={(pickedFiles) => {
              setFiles(prev => [
                ...prev,
                ...pickedFiles,
              ]);
            }}
            setStatus={setStatus}
            />

          <DropboxMediaFileInput
            onFilePicked={(pickedFiles) => {
              setFiles(prev => [
                ...prev,
                ...pickedFiles
              ]);
            }}
            setStatus={setStatus}
            />
        </div>

      </div>
      {files.length > 0 && (
        <div className="mp3-joiner-files">
          <h4 className="mp3-joiner-files-title">
            Selected Files
          </h4>

          {files.map((file, index) => (
            <div
            key={index}
            className="mp3-joiner-file-item"
            >
              <span className="mp3-joiner-file-name">
                {index + 1}. {file.name}
              </span>

              <div className="mp3-joiner-actions">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="mp3-joiner-btn move-btn"
                  >
                  ▲
                </button>

                <button
                  onClick={() => moveDown(index)}
                  disabled={
                    index === files.length - 1
                  }
                  className="mp3-joiner-btn move-btn"
                  >
                  ▼
                </button>

                <button
                  onClick={() =>
                    removeFile(index)
                  }
                  className="mp3-joiner-btn remove-btn"
                  >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <MediaDropzoneInput
        onFilesAccepted={handleFilesAccepted}
        multiple={true}
        filenam='Mp3'
        overlayText="🎵 Drop MP3 Files Here"
        accept={{
          "audio/mpeg": [".mp3"],
        }}
        />
      )}
      <div className="mp3btn">

        <button
          onClick={mergeMp3}
          disabled={
            loading || files.length < 2
          }
          className="mp3-joiner-merge-btn"
          >
          {loading
            ? "Processing..."
            : "Merge MP3"}
        </button>
      </div>

      {status && (
        <div className="mp3-joiner-status">
          Status: {status}
        </div>
      )}

      {downloadUrl && (
        <div className="mp3-joiner-download">
          <a
            href={downloadUrl}
            download="merged.mp3"
            className="mp3-joiner-download-link"
            >
            Download Merged MP3
          </a>
        </div>
      )}

      {mergedFile && (
        <>
          <p style={{ marginTop: "15px", }} className="saveToTitle">
            Save File To...
          </p>

          <div className="saveTo">
            <SaveToGoogleDrive file={mergedFile} />
            <SaveToDropbox file={mergedFile} />
          </div>
        </>
      )}
     
    </div>
    
    <section className="mp3JoinerContent">
  <h2>Merge MP3 Files Online Easily</h2>

  <p>
    MP3 Joiner is a free online tool that allows you to merge multiple MP3
    files into a single audio file directly from your browser. Whether you
    want to combine songs, create a podcast episode, merge voice recordings,
    join audiobook chapters, or organize audio clips into one track, our
    tool makes the process simple and fast. No software installation is
    required, and your files can be processed within a few clicks.
  </p>
      <div className="mp3imageicon">

      <img src="music-app.png" alt="Mp3 music Icon"   />
      </div>

  <p>
    Many users need a reliable way to combine audio files without dealing
    with complicated editing software. Traditional audio editors often
    require downloads, account creation, and advanced technical knowledge.
    With MP3 Joiner, you can upload your audio files, arrange them in the
    desired order, and generate a single MP3 file in minutes. The interface
    is designed for beginners while still being efficient enough for regular
    users who frequently work with audio content.
  </p>

  <h2>Why Use an Online MP3 Joiner?</h2>

  <p>
    Combining audio files is useful for many different purposes. Musicians
    can create demo tracks, students can organize lecture recordings,
    podcasters can merge multiple segments, and content creators can prepare
    audio content for publishing. Instead of managing several individual
    files, you can create one organized MP3 that is easier to share,
    download, store, and play.
  </p>

  <p>
    Online tools provide a convenient alternative to desktop applications.
    Since everything works within your browser, there is no need to install
    additional software or worry about operating system compatibility. The
    tool works on Windows, macOS, Linux, Android, and iPhone devices,
    allowing you to merge MP3 files from virtually anywhere.
  </p>

  <h2>How to Join MP3 Files</h2>

  <p>
    Using the MP3 Joiner is straightforward. First, upload the MP3 files you
    want to combine. Once the files are added, arrange them in the order in
    which they should appear in the final audio. After reviewing the
    sequence, start the merging process. The tool will combine the selected
    files into a single MP3, which you can then download to your device.
  </p>

  <p>
    The ability to control file order is important because the final output
    follows the exact sequence you choose. This makes the tool ideal for
    creating playlists, educational recordings, guided meditations,
    audiobooks, interviews, and long-form audio presentations.
  </p>

   <h2 style={{ marginBottom: "4px" }}>Also Related PDF Conversion & Compression Tools </h2>
              <div className="pdfpageslinks">
  
              <div className="unzipPagelink">
                <ul>
  
                <li><Link to="/word-to-pdf" className='btn' >Word To PDF Converter </Link></li>
                <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
                <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
                <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
                <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
                <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
                <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
                <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
                <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
                <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
                <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
                <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
                <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
                <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
                </ul>
              </div>
              </div>
  

  <h2>Perfect for Podcasts and Voice Recordings</h2>

  <p>
    Podcast creators often record multiple segments separately. Introductions,
    interviews, advertisements, and conclusions may all exist as individual
    files. Instead of publishing several audio files, creators can merge
    everything into a single episode. This improves listener experience and
    simplifies distribution across podcast platforms.
  </p>

  <p>
    The same benefit applies to voice recordings. Meeting notes, lectures,
    presentations, and personal recordings can be combined into one file,
    making them easier to manage and review later. Students and
    professionals frequently use audio merging tools to organize large
    collections of recordings.
  </p>

  <h2>Create Continuous Music Playlists</h2>

  <p>
    Music enthusiasts often use MP3 joining tools to combine multiple tracks
    into a single audio file. This can be useful when creating workout
    playlists, party mixes, meditation sessions, relaxation audio, or
    custom compilations. Having a single audio file eliminates interruptions
    between tracks and makes playback more convenient.
  </p>

  <p>
    DJs, performers, and event organizers may also benefit from combining
    audio files into one continuous track. This reduces the need for manual
    file switching during presentations, events, or performances.
  </p>

  <h2>Works on Desktop and Mobile Devices</h2>

  <p>
    Modern users expect flexibility, and MP3 Joiner is designed to work
    across different devices. Whether you are using a desktop computer,
    laptop, tablet, or smartphone, the tool can help you combine MP3 files
    quickly. The responsive interface adapts to different screen sizes,
    ensuring a smooth experience on both large and small displays.
  </p>

  <p>
    Mobile support is particularly useful for users who need to edit audio
    while traveling or working remotely. Instead of transferring files to a
    computer, audio can be merged directly from a mobile browser.
  </p>

  <h2>Fast and User-Friendly Experience</h2>

  <p>
    Speed and simplicity are important when working with digital files. The
    MP3 Joiner focuses on providing a clean and efficient workflow that
    minimizes unnecessary steps. Upload files, arrange them, merge them, and
    download the result. This straightforward process helps users save time
    while still producing a professional result.
  </p>

  <p>
    Unlike many traditional audio editing programs, there is no steep
    learning curve. Even first-time users can understand the process within
    seconds. The intuitive interface reduces confusion and helps users
    complete their tasks quickly.
  </p>

  <h2>Privacy and Security</h2>

  <p>
    File privacy is an important concern for many users. When working with
    personal recordings, interviews, educational content, or business audio,
    users want confidence that their files are handled securely. Browser-
    based processing can help reduce the need for unnecessary file transfers
    and provides a convenient way to work with audio content online.
  </p>

  <p>
    Users should always review a website's privacy practices and understand
    how files are processed. A transparent approach to file handling helps
    build trust and provides a better overall user experience.
  </p>

  <h2>Frequently Asked Questions</h2>

  <h3>Can I merge multiple MP3 files at once?</h3>
  <p>
    Yes. You can upload several MP3 files and combine them into a single
    audio file in the order you choose.
  </p>

  <h3>Will the audio quality be reduced?</h3>
  <p>
    The goal is to preserve audio quality while creating a combined file.
    Actual results may vary depending on source files and processing
    settings.
  </p>

  <h3>Do I need to install software?</h3>
  <p>
    No. The tool works directly in your web browser, eliminating the need
    for downloads or installations.
  </p>

  <h3>Can I use the MP3 Joiner on mobile devices?</h3>
  <p>
    Yes. The tool is compatible with Android phones, iPhones, tablets,
    laptops, and desktop computers.
  </p>

  <h3>Is the MP3 Joiner free?</h3>
  <p>
    Yes. Users can merge MP3 files online without purchasing expensive audio
    editing software.
  </p>

  <h2>Start Combining MP3 Files Today</h2>

  <p>
    Whether you need to merge music tracks, organize voice recordings,
    combine podcast segments, or create a single audio file for easier
    sharing, MP3 Joiner provides a simple and efficient solution. Upload
    your files, arrange them in the correct order, and create a combined MP3
    file in just a few clicks. The process is fast, accessible, and designed
    to work across modern devices and browsers, making audio merging easier
    than ever.
  </p>
</section>
     </>
     
    );}