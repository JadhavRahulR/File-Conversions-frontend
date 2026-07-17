import { useState, useRef, useEffect } from "react";
import './mp3joiner.css';

import MediaDropzoneInput from "./MediaDropzoneInput";
import DriveMediaInput from "./DriveMediaInput";
import DropboxMediaFileInput from "./DropboxMediaFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { Helmet } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";

export default function VideoToGif() {

  const [videoFile, setVideoFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [gifUrl, setGifUrl] = useState("");

  const [gifFile, setGifFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");

  const [progress, setProgress] = useState(0);

  const [duration, setDuration] = useState(0);

  const [startTime, setStartTime] = useState(0);

  const [endTime, setEndTime] = useState(5);

  const [fps, setFps] = useState(12);

  const [width, setWidth] = useState("480");

  const [quality, setQuality] = useState("medium");

  const videoRef = useRef(null);

  const ffmpegRef = useRef(null);

  //--------------------------------------------------

  const handleVideo = (file) => {



    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Maximum file size is 100 MB.");
      return;
    }

    setVideoFile(file);

    setGifUrl("");

    setGifFile(null);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  };

  //--------------------------------------------------

  const handleInput = (e) => {

    const file = e.target.files[0];

    handleVideo(file);

  };

  //--------------------------------------------------

  const handleDrop = (acceptedFiles) => {

    if (!acceptedFiles.length) return;

    handleVideo(acceptedFiles[0]);

  };

  //--------------------------------------------------

  const onLoadedMetadata = (e) => {

    const d = e.target.duration;

    setDuration(d);

    setStartTime(0);

    setEndTime(Math.min(15, Math.floor(d)));

  };

  //--------------------------------------------------

  const loadFFmpeg = async () => {

    if (ffmpegRef.current) return ffmpegRef.current;

    setStatus("Loading FFmpeg...");

    const ffmpeg = new FFmpeg();

    await ffmpeg.load();

    ffmpeg.on("progress", ({ progress }) => {

      setProgress(Math.round(progress * 100));

    });

    ffmpegRef.current = ffmpeg;


    setStatus("Ready to convert");

    return ffmpeg;

  };

  //--------------------------------------------------

  const convertGif = async () => {

    if (!videoFile) {

      alert("Please select a video.");

      return;

    }

    if (endTime <= startTime) {

      alert("End time must be greater than Start time.");

      return;

    }

    if ((endTime - startTime) > 15) {

      alert("Maximum GIF duration is 15 seconds.");

      return;

    }

    try {

      setLoading(true);

      setProgress(0);

      setStatus("Preparing...");

      const ffmpeg = await loadFFmpeg();

      setStatus("Loading Video...");

      await ffmpeg.writeFile(

        "input",

        await fetchFile(videoFile)

      );

      let scaleFilter =
        width === "original"
          ? `fps=${fps}`
          : `fps=${fps},scale=${width}:-1:flags=lanczos`;

      let qualityValue = "15";

      if (quality === "low") qualityValue = "25";

      if (quality === "medium") qualityValue = "15";

      if (quality === "high") qualityValue = "8";

      setStatus("Generating GIF...");

      await ffmpeg.exec([

        "-ss",
        String(startTime),

        "-t",
        String(endTime - startTime),

        "-i",
        "input",

        "-vf",
        scaleFilter,

        "-loop",
        "0",

        "-q:v",
        qualityValue,

        "output.gif"

      ]);

      setStatus("Creating File...");

      const data = await ffmpeg.readFile("output.gif");

      const blob = new Blob(

        [data.buffer],

        {

          type: "image/gif"

        }

      );

      const file = new File(

        [blob],

        "animated.gif",

        {

          type: "image/gif"

        }

      );

      setGifFile(file);

      const url = URL.createObjectURL(blob);

      setGifUrl(url);

      setStatus("Ready");

    }

    catch (err) {
      console.error(err);
      console.error(err.stack);
      alert(err.message);
    }
    finally {

      setLoading(false);

    }

  };

  //--------------------------------------------------

  const resetAll = () => {

    setVideoFile(null);

    setPreviewUrl("");

    setGifUrl("");

    setGifFile(null);

    setStatus("");

    setProgress(0);

    setDuration(0);

    setStartTime(0);

    setEndTime(5);

  };


  useEffect(() => {

    loadFFmpeg();

  }, []);
  // -------------------------------
  // JSX Part will continue in Part 2
  // -------------------------------

  return (
    <>
      <Helmet>
        <title>Video To Animated GIF Converter Free</title>

        <meta
          name="description"
          content="Convert MP4, MOV, WebM and AVI videos to animated GIF online for free. Create high-quality GIFs directly in your browser without uploading files."
        />

        <meta
          name="keywords"
          content="video to gif, mp4 to gif, gif maker, convert video to gif, online gif converter"
        />

        <link
          rel="canonical"
          href="https://fileunivers.com/video-to-gif"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      <ScrollToTop />

      <div className="headingsection">

        <h1>
          Video to Animated GIF Converter
        </h1>

          <p>
  Convert videos to animated GIFs online with our free Video to GIF Converter. Easily
  turn MP4, MOV, WebM, AVI, MKV, and other popular video formats into
  high-quality animated GIFs directly in your browser. No uploads, no
  watermarks, and no software installation required. Trim your video, customize
  the output resolution, FPS, and quality, then download your GIF instantly.
  Supports files up to 100 MB and GIFs up to 15 seconds long.
</p>

      </div>

      <div className="mp3-joiner-container">

        <h2 className="mp3-joiner-title">
          Convert Video to GIF
        </h2>

        <input
          type="file"
          accept="video/*"
          className="mp3-joiner-input"
          onChange={handleInput}
        />

        <div className="filecontainer">

          <div className="fileuploadcontainer">

            <DriveMediaInput
              allowedTypes={[
                ".mp4",
                ".mov",
                ".webm",
                ".avi",
                ".mkv"
              ]}
              onFilePicked={(files) => {

                if (files.length)
                  handleVideo(files[0]);

              }}
              setStatus={setStatus}
            />

            <DropboxMediaFileInput
              onFilePicked={(files) => {

                if (files.length)
                  handleVideo(files[0]);

              }}
              setStatus={setStatus}
            />

          </div>

        </div>

        {!videoFile && (

          <MediaDropzoneInput

            onFilesAccepted={handleDrop}

            multiple={false}

            overlayText="🎥 Drop Video Here"

            filenam='video'

            accept={{
              "video/*": [
                ".mp4",
                ".mov",
                ".avi",
                ".webm",
                ".mkv"
              ]
            }}

          />

        )}

        {videoFile && (

          <div className="videoPreviewContainer">

            <video

              ref={videoRef}

              src={previewUrl}

              controls

              onLoadedMetadata={onLoadedMetadata}

              className="videoPreview"

            />

            <p>

              <strong>File:</strong>

              {videoFile.name}

            </p>

            <p>

              <strong>Duration:</strong>

              {duration.toFixed(2)} sec

            </p>

            <button

              className="mp3-joiner-btn remove-btn"

              onClick={resetAll}

            >

              Remove Video

            </button>

          </div>

        )}

        {videoFile && (

          <div className="gifControls">

            <div className="controlItem">

              <label>

                Start Time (sec)

              </label>

              <input

                type="number"

                min="0"

                max={Math.floor(duration)}

                value={startTime}

                onChange={(e) =>
                  setStartTime(
                    Number(e.target.value)
                  )
                }

              />

            </div>

            <div className="controlItem">

              <label>

                End Time (sec)

              </label>

              <input

                type="number"

                min="1"

                max={Math.floor(duration)}

                value={endTime}

                onChange={(e) =>
                  setEndTime(
                    Number(e.target.value)
                  )
                }

              />

            </div>

            <div className="controlItem">

              <label>

                Resolution

              </label>

              <select

                value={width}

                onChange={(e) =>
                  setWidth(
                    e.target.value
                  )
                }

              >

                <option value="original">
                  Original
                </option>

                <option value="240">
                  240 px
                </option>

                <option value="360">
                  360 px
                </option>

                <option value="480">
                  480 px
                </option>

                <option value="720">
                  720 px
                </option>

                <option value="1080">
                  1080 px
                </option>

              </select>

            </div>

            <div className="controlItem">

              <label>
                FPS
              </label>

              <select
                value={fps}
                onChange={(e) =>
                  setFps(Number(e.target.value))
                }
              >
                <option value={5}>5 FPS</option>
                <option value={8}>8 FPS</option>
                <option value={10}>10 FPS</option>
                <option value={12}>12 FPS</option>
                <option value={15}>15 FPS</option>
                <option value={20}>20 FPS</option>
              </select>

            </div>

            <div className="controlItem">

              <label>
                Quality
              </label>

              <select
                value={quality}
                onChange={(e) =>
                  setQuality(e.target.value)
                }
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>

          </div>

        )}

        {videoFile && (

          <div className="mp3btn">

            <button

              className="mp3-joiner-merge-btn"

              onClick={convertGif}

              disabled={loading}

            >

              {loading
                ? "Processing..."
                : "Convert To GIF"}

            </button>

          </div>

        )}

        {status && (

          <div className="mediafilestatus">

            {status}

          </div>

        )}

        {loading && (

          <div
            style={{
              width: "100%",
              marginTop: "20px"
            }}
          >

            <progress
              value={progress}
              max="100"
              style={{
                width: "100%"
              }}
            />

            <p
              style={{
                textAlign: "center"
              }}
            >
              {progress} %
            </p>

          </div>

        )}

        {gifUrl && (

          <div
            className="gifResult"
          >

            <h3>
              GIF Preview
            </h3>

            <img
              src={gifUrl}
              alt="GIF Preview"
              className="gifPreview"
            />

            <div
              style={{
                marginTop: "20px"
              }}
            >

              <a

                href={gifUrl}

                download="animated.gif"

                className="mp3-joiner-download-link"

              >

                Download GIF

              </a>

            </div>

          </div>

        )}

        {gifFile && (

          <>

            <p
              className="saveToTitle"
              style={{
                marginTop: "20px"
              }}
            >
              Save File To...
            </p>

            <div className="saveTo">

              <SaveToGoogleDrive
                file={gifFile}
              />

              <SaveToDropbox
                file={gifFile}
              />

            </div>

          </>

        )}

      </div>

      <div className="maincontentsection">

        <div className="blog-content">

          <h2 className="blog-heading">Convert Videos to Animated GIFs Online</h2>

          <p className="blog-paragraph">
            The Video to GIF Converter makes it easy to turn your favorite video clips
            into high-quality animated GIFs directly in your browser. Whether you're
            creating reaction GIFs, social media content, tutorials, product demos, or
            short animations, this tool provides a fast and simple solution without
            requiring software installation. Your videos are processed locally, so they
            stay on your device throughout the conversion process. No uploads, no
            watermarks, and no unnecessary waiting. The converter supports popular video
            formats including MP4, MOV, WebM, AVI, and many others. You can upload files
            up to <strong>100 MB</strong> and convert clips up to
            <strong>15 seconds</strong> long into smooth animated GIFs.
          </p>

          <div className="tool-info">

            <h2>How to Convert Video to GIF?</h2>

            <ol>
              <li>Select a video from your device, Google Drive or Dropbox.</li>
              <li>Choose the start and end time (maximum 15 seconds).</li>
              <li>Select output resolution, FPS and quality.</li>
              <li>Click <strong>Convert To GIF</strong>.</li>
              <li>Download your GIF or save it directly to Google Drive or Dropbox.</li>
            </ol>

            <h2>Features</h2>

            <ul>
              <li>100% Browser Based</li>
              <li>No Upload To Server</li>
              <li>Maximum Upload Size: 100 MB</li>
              <li>Maximum GIF Duration: 15 Seconds</li>
              <li>Supports MP4, MOV, AVI, MKV and WebM</li>
              <li>Resolution up to 1080p</li>
              <li>Choose FPS and Quality</li>
              <li>Works on Windows, Mac, Linux, Android and iPhone</li>
            </ul>

          </div>


          <h2 className="blog-heading">Choose Your Video</h2>

          <p className="blog-paragraph">
            Uploading a video is quick and flexible. Simply drag and drop your file into
            the upload area to begin instantly. If you prefer, click the upload section
            to browse and select a video from your local computer. The converter also
            supports importing videos directly from <strong>Google Drive</strong> and
            <strong>Dropbox</strong>, allowing you to work with files stored in the
            cloud without downloading them first. Whether your videos are stored on your
            desktop or online, you can start converting in just a few clicks.
          </p>

          <h2 className="blog-heading">Trim Only the Part You Need</h2>

          <p className="blog-paragraph">
            Instead of converting an entire video, you can choose exactly which section
            you want to turn into a GIF. Simply enter the desired
            <strong> Start Time </strong> and <strong>End Time</strong> to capture the
            perfect moment. Since GIFs are limited to a maximum duration of
            <strong>15 seconds</strong>, trimming helps you create compact animations
            that load quickly and are easy to share on websites, social media, blogs,
            and messaging apps.
          </p>

          <h2 className="blog-heading">Customize Resolution, FPS, and Quality</h2>

          <p className="blog-paragraph">
            Before converting your video, you can adjust several settings to achieve the
            perfect balance between quality and file size. Select your preferred output
            resolution, choose the desired frame rate (FPS), and set the GIF quality.
            Lower settings create smaller files that are easier to share, while higher
            settings produce smoother animations with better visual detail. These
            options allow you to optimize your GIF for different platforms and use
            cases.
          </p>

          <h2 className="blog-heading">Preview Before Downloading</h2>

          <p className="blog-paragraph">
            Once the conversion is complete, the generated animation appears in the
            built-in GIF preview section. This lets you check the final result before
            saving it. If you want to make changes, simply adjust the trim range,
            resolution, FPS, or quality settings and convert the video again until the
            GIF looks exactly the way you want.
          </p>

          <h2 className="blog-heading">Download or Save to Cloud Storage</h2>

          <p className="blog-paragraph">
            After your GIF is ready, it is automatically available for download to your
            local device with a single click. If you prefer cloud storage, you can also
            save the converted GIF directly to your
            <strong> Google Drive </strong> or <strong>Dropbox</strong> account. This
            makes it easy to organize your files, access them from multiple devices, and
            share them with others without performing an extra upload later.
          </p>

          <h2 className="blog-heading">Why Use This Video to GIF Converter?</h2>

          <ul className="blog-list">
            <li>Convert MP4, MOV, WebM, AVI, and other popular video formats.</li>
            <li>Works entirely in your browser.</li>
            <li>No uploads required during processing.</li>
            <li>No watermark added to your GIFs.</li>
            <li>Supports video files up to 100 MB.</li>
            <li>Create GIFs up to 15 seconds long.</li>
            <li>Upload videos using drag and drop.</li>
            <li>Select files directly from your local computer.</li>
            <li>Import videos from Google Drive.</li>
            <li>Import videos from Dropbox.</li>
            <li>Trim videos before converting.</li>
            <li>Customize resolution, FPS, and quality.</li>
            <li>Preview your GIF before downloading.</li>
            <li>Automatically download the completed GIF locally.</li>
            <li>Save the finished GIF directly to Google Drive.</li>
            <li>Save the finished GIF directly to Dropbox.</li>
            <li>Fast, secure, and beginner-friendly.</li>
          </ul>

          <h2 className="blog-heading">Perfect for Everyday Use</h2>

          <p className="blog-paragraph">
            Whether you're creating animated memes, reaction GIFs, educational
            tutorials, marketing content, product demonstrations, or social media posts,
            this Video to GIF Converter provides everything you need in one place.
            Simply upload your video using drag and drop, your local device, Google
            Drive, or Dropbox, customize the settings, convert the clip, preview the
            result, and save the completed GIF either locally or directly to your
            preferred cloud storage.
          </p>


        <div className="faq-section">

  <h2 className="blog-heading">
    Frequently Asked Questions (FAQs)
  </h2>

  <div className="faq-item">
    <h3 className="faq-question">
      1. What video formats are supported?
    </h3>
    <p className="faq-answer">
      The Video to GIF Converter supports most popular video formats, including
      MP4, MOV, WebM, AVI, MKV, and many others. Simply upload your video and
      convert it into an animated GIF in a few clicks.
    </p>
  </div>

  <div className="faq-item">
    <h3 className="faq-question">
      2. Are my videos uploaded to a server?
    </h3>
    <p className="faq-answer">
      No. Your videos are processed directly in your browser whenever possible,
      which means your files stay on your device and are not uploaded to our
      servers during the conversion process.
    </p>
  </div>

  <div className="faq-item">
    <h3 className="faq-question">
      3. What is the maximum video size and GIF duration?
    </h3>
    <p className="faq-answer">
      You can upload video files up to <strong>100 MB</strong>. The maximum GIF
      duration is <strong>15 seconds</strong>, helping you create lightweight
      GIFs that are easy to share online.
    </p>
  </div>

  <div className="faq-item">
    <h3 className="faq-question">
      4. Can I customize the GIF before converting?
    </h3>
    <p className="faq-answer">
      Yes. You can trim the video by selecting the start and end time, choose
      the output resolution, adjust the frame rate (FPS), and select the GIF
      quality before starting the conversion.
    </p>
  </div>

  <div className="faq-item">
    <h3 className="faq-question">
      5. Can I import videos from Google Drive or Dropbox?
    </h3>
    <p className="faq-answer">
      Yes. Besides uploading files from your computer using drag and drop or
      the file picker, you can also import videos directly from Google Drive
      and Dropbox for a faster workflow.
    </p>
  </div>

  <div className="faq-item">
    <h3 className="faq-question">
      6. Where can I save my converted GIF?
    </h3>
    <p className="faq-answer">
      After the conversion is complete, you can download the GIF directly to
      your local device or save it to your Google Drive or Dropbox account for
      easy access and sharing across your devices.
    </p>
  </div>

</div>



        </div>





      </div>
    </>
  );

}