import { useState, useRef, useEffect } from "react";
import "./ringtonemaker.css";

import MediaDropzoneInput from "./MediaDropzoneInput";
import DriveMediaInput from "./DriveMediaInput";
import DropboxMediaFileInput from "./DropboxMediaFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { Helmet } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";
import RingtoneWaveform from "./RingtoneWaveform";

export default function RingtoneMaker() {
    // --------------------------------------------------
    // File states
    // --------------------------------------------------

    const [audioFile, setAudioFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [ringtoneUrl, setRingtoneUrl] = useState("");
    const [ringtoneFile, setRingtoneFile] = useState(null);

    // --------------------------------------------------
    // Processing states
    // --------------------------------------------------

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);

    // --------------------------------------------------
    // Audio states
    // --------------------------------------------------

    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [volume, setVolume] = useState(1);
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    // --------------------------------------------------
    // Ringtone name
    // --------------------------------------------------

    const [ringtoneName, setRingtoneName] = useState("My-Ringtone");

    // --------------------------------------------------
    // Refs
    // --------------------------------------------------

    const audioRef = useRef(null);
    const ffmpegRef = useRef(null);

    // --------------------------------------------------
    // Handle audio file
    // --------------------------------------------------

    const handleAudio = (file) => {
        if (!file) return;

        // Maximum file size: 100 MB
        if (file.size > 100 * 1024 * 1024) {
            alert("Maximum file size is 100 MB.");
            return;
        }

        setAudioFile(file);

        setRingtoneUrl("");
        setRingtoneFile(null);

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);

        // Reset settings
        setStartTime(0);
        setEndTime(30);
        setProgress(0);
        setStatus("");
    };

    // --------------------------------------------------
    // Normal file input
    // --------------------------------------------------

    const handleInput = (e) => {
        const file = e.target.files[0];

        handleAudio(file);
    };

    // --------------------------------------------------
    // Dropzone
    // --------------------------------------------------

    const handleDrop = (acceptedFiles) => {
        if (!acceptedFiles.length) return;

        handleAudio(acceptedFiles[0]);
    };

    // --------------------------------------------------
    // Audio metadata loaded
    // --------------------------------------------------

    const onLoadedMetadata = (e) => {
        const d = e.target.duration;

        if (!d || !isFinite(d)) return;

        setDuration(d);
        setStartTime(0);

        // Song ka 70%
        const seventyPercent = d * 0.70;

        setEndTime(
            Number(seventyPercent.toFixed(1))
        );
    };
    // --------------------------------------------------
    // Load FFmpeg
    // --------------------------------------------------

    const loadFFmpeg = async () => {
        if (ffmpegRef.current) {
            return ffmpegRef.current;
        }

        setStatus("Loading FFmpeg...");

        const ffmpeg = new FFmpeg();

        await ffmpeg.load();

        ffmpeg.on("progress", ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        ffmpegRef.current = ffmpeg;

        setStatus("Upload or Drag and Drop Mp3 file");

        return ffmpeg;
    };

    // --------------------------------------------------
    // Create ringtone
    // --------------------------------------------------

    const createRingtone = async () => {
        if (!audioFile) {
            alert("Please select an audio file.");
            return;
        }

        if (endTime <= startTime) {
            alert("End time must be greater than Start time.");
            return;
        }

        if (endTime - startTime > 60) {
            alert("Maximum ringtone duration is 60 seconds.");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);
            setStatus("Preparing...");

            const ffmpeg = await loadFFmpeg();

            // --------------------------------------------------
            // Input file
            // --------------------------------------------------

            setStatus("Loading Audio...");

            const inputExtension =
                audioFile.name.split(".").pop()?.toLowerCase() || "mp3";

            const inputName = `input.${inputExtension}`;

            await ffmpeg.writeFile(
                inputName,
                await fetchFile(audioFile)
            );

            // --------------------------------------------------
            // Output filename
            // --------------------------------------------------

            let cleanName = ringtoneName.trim();

            if (!cleanName) {
                cleanName = "My-Ringtone";
            }

            // Remove unsafe filename characters
            cleanName = cleanName.replace(/[<>:"/\\|?*]+/g, "");

            const outputName = "ringtone.mp3";

            // --------------------------------------------------
            // Audio filters
            // --------------------------------------------------

            const filters = [];

            // Volume
            if (volume !== 1) {
                filters.push(`volume=${volume}`);
            }

            // Fade In
            if (fadeIn) {
                const fadeInDuration = Math.min(
                    3,
                    endTime - startTime
                );

                filters.push(`afade=t=in:st=0:d=${fadeInDuration}`);
            }

            // Fade Out
            if (fadeOut) {
                const totalDuration = endTime - startTime;

                const fadeOutDuration = Math.min(
                    3,
                    totalDuration
                );

                const fadeOutStart =
                    totalDuration - fadeOutDuration;

                filters.push(
                    `afade=t=out:st=${fadeOutStart}:d=${fadeOutDuration}`
                );
            }

            // --------------------------------------------------
            // FFmpeg command
            // --------------------------------------------------

            setStatus("Creating Ringtone...");

            const command = [
                "-ss",
                String(startTime),

                "-t",
                String(endTime - startTime),

                "-i",
                inputName,

                "-vn",

                "-acodec",
                "libmp3lame",

                "-b:a",
                "192k",
            ];

            // Add filters only if required
            if (filters.length > 0) {
                command.push(
                    "-af",
                    filters.join(",")
                );
            }

            command.push(
                "-y",
                outputName
            );

            await ffmpeg.exec(command);

            // --------------------------------------------------
            // Read generated ringtone
            // --------------------------------------------------

            setStatus("Creating File...");

            const data = await ffmpeg.readFile(outputName);

            const blob = new Blob(
                [data.buffer],
                {
                    type: "audio/mpeg",
                }
            );

            const file = new File(
                [blob],
                `${cleanName}.mp3`,
                {
                    type: "audio/mpeg",
                }
            );

            setRingtoneFile(file);

            const url = URL.createObjectURL(blob);

            setRingtoneUrl(url);

            setStatus("Ringtone Ready");
            setProgress(100);

            // --------------------------------------------------
            // Cleanup FFmpeg files
            // --------------------------------------------------

            try {
                await ffmpeg.deleteFile(inputName);
                await ffmpeg.deleteFile(outputName);
            } catch (cleanupError) {
                console.log("FFmpeg cleanup:", cleanupError);
            }

        } catch (err) {
            console.error(err);
            console.error(err.stack);

            alert(
                err.message || "Failed to create ringtone."
            );

            setStatus("Error");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // Reset
    // --------------------------------------------------

    const resetAll = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (ringtoneUrl) {
            URL.revokeObjectURL(ringtoneUrl);
        }

        setAudioFile(null);
        setPreviewUrl("");

        setRingtoneUrl("");
        setRingtoneFile(null);

        setStatus("");
        setProgress(0);

        setDuration(0);

        setStartTime(0);
        setEndTime(30);

        setVolume(1);

        setFadeIn(false);
        setFadeOut(false);

        setRingtoneName("My-Ringtone");
    };

    // --------------------------------------------------
    // Load FFmpeg on page load
    // --------------------------------------------------

    useEffect(() => {
        loadFFmpeg();

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            if (ringtoneUrl) {
                URL.revokeObjectURL(ringtoneUrl);
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {

            const start = Number(startTime);
            const end = Number(endTime);

            if (
                !Number.isFinite(start) ||
                !Number.isFinite(end)
            ) {
                return;
            }

            // End point par pahunch gaya
            if (audio.currentTime >= end) {

                audio.pause();

                // Dobara play karne par selection ke
                // beginning se start hoga
                audio.currentTime = start;
            }
        };

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        return () => {
            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );
        };

    }, [startTime, endTime]);


    useEffect(() => {

        const audio = audioRef.current;

        if (!audio) return;

        const start = Number(startTime);

        if (
            Number.isFinite(start) &&
            start >= 0
        ) {
            audio.currentTime = start;
        }

    }, [startTime]);

    // --------------------------------------------------
    // JSX
    // --------------------------------------------------

    return (
        <>
            <Helmet>

                <title>
                    Ringtone Generator online | Free Ringtone Maker
                </title>

                <meta
                    name="description"
                    content="Create custom ringtones online for free. Trim MP3, WAV, M4A and other audio files, adjust volume, add fade effects and download your ringtone instantly."
                />

                <meta
                    name="keywords"
                    content="ringtone maker, ringtone maker online, create ringtone, mp3 ringtone maker, make ringtone, trim ringtone, free ringtone maker,ringtone generator"
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/ringtone-maker"
                />

                <meta
                    name="robots"
                    content="index,follow"
                />

            </Helmet>

            <ScrollToTop />

            {/* --------------------------------------------------
          Page Heading
      -------------------------------------------------- */}


            <div className="headingsection">

                <h1>
                    Ringtone Generator online
                </h1>

                <p>
                    <p>
                        Create custom ringtones online for free with our ringtone maker.
                        Trim MP3, WAV and other audio files, choose the perfect ringtone
                        length, adjust volume, add fade effects and download your ringtone instantly.
                    </p>
                </p>

            </div>

            {/* --------------------------------------------------
          Main Container
      -------------------------------------------------- */}

            <div className="ringtone-maker-container">

                <h2 className="ringtone-maker-title">
                    Create Your Ringtone
                </h2>

                {/* --------------------------------------------------
            Normal File Input
        -------------------------------------------------- */}

                <input
                    type="file"
                    accept="audio/*"
                    className="ringtone-maker-input"
                    onChange={handleInput}
                />

                {/* --------------------------------------------------
            Drive / Dropbox
        -------------------------------------------------- */}

                <div className="filecontainer">

                    <div className="fileuploadcontainer">

                        <DriveMediaInput
                            allowedTypes={[
                                ".mp3",
                                ".wav",
                                ".m4a",
                                ".aac",
                                ".ogg",
                                ".flac",
                                ".opus"
                            ]}
                            onFilePicked={(files) => {

                                if (files.length) {
                                    handleAudio(files[0]);
                                }

                            }}
                            setStatus={setStatus}
                        />

                        <DropboxMediaFileInput
                            onFilePicked={(files) => {

                                if (files.length) {
                                    handleAudio(files[0]);
                                }

                            }}
                            setStatus={setStatus}
                        />

                    </div>

                </div>

                {/* --------------------------------------------------
            Dropzone
        -------------------------------------------------- */}

                {!audioFile && (

                    <MediaDropzoneInput
                        onFilesAccepted={handleDrop}
                        multiple={false}
                        overlayText="🎵 Drop Audio Here"
                        filenam="audio"
                        accept={{
                            "audio/*": [
                                ".mp3",
                                ".wav",
                                ".m4a",
                                ".aac",
                                ".ogg",
                                ".flac",
                                ".opus"
                            ]
                        }}
                    />

                )}

                {/* --------------------------------------------------
            Audio Preview
        -------------------------------------------------- */}

                {/* ==========================================
    Audio Preview
========================================== */}

                {audioFile && (
                    <audio
                        ref={audioRef}
                        src={previewUrl}
                        onLoadedMetadata={onLoadedMetadata}
                        style={{ display: "none" }}
                    />
                )}


                {/* ==========================================
    Handmade Waveform Editor
========================================== */}

                {audioFile && duration > 0 && (
                    <RingtoneWaveform
                        audioFile={audioFile}
                        audioRef={audioRef}
                        duration={duration}
                        startTime={startTime}
                        endTime={endTime}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                    />
                )}

                {/* --------------------------------------------------
            Controls
        -------------------------------------------------- */}

                {audioFile && (

                    <div className="ringtoneControls">

                        {/* Start Time */}

                        {/* Start Time */}
                        <div className="controlItem">

                            <label>
                                Start Time (sec)
                            </label>

                            <input
                                type="number"
                                min="0"
                                max={Math.floor(duration)}
                                step="0.1"
                                value={startTime}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Empty value bhi temporarily allow karo
                                    if (value === "") {
                                        setStartTime("");
                                        return;
                                    }

                                    setStartTime(Number(value));
                                }}
                                onBlur={() => {
                                    let value = Number(startTime);

                                    if (!Number.isFinite(value)) {
                                        value = 0;
                                    }

                                    value = Math.max(0, value);

                                    // Start cannot be equal to or greater than end
                                    if (value >= Number(endTime)) {
                                        value = Math.max(
                                            0,
                                            Number(endTime) - 0.1
                                        );
                                    }

                                    if (duration > 0) {
                                        value = Math.min(
                                            value,
                                            duration - 0.1
                                        );
                                    }

                                    setStartTime(
                                        Number(value.toFixed(1))
                                    );
                                }}
                            />

                        </div>


                        {/* End Time */}
                        <div className="controlItem">

                            <label>
                                End Time (sec)
                            </label>

                            <input
                                type="number"
                                min="0.1"
                                max={Math.floor(duration)}
                                step="0.1"
                                value={endTime}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Empty value temporarily allow karo
                                    if (value === "") {
                                        setEndTime("");
                                        return;
                                    }

                                    setEndTime(Number(value));
                                }}
                                onBlur={() => {
                                    let value = Number(endTime);

                                    if (!Number.isFinite(value)) {
                                        value = Number(duration) || 0.1;
                                    }

                                    value = Math.max(
                                        Number(startTime) + 0.1,
                                        value
                                    );

                                    if (duration > 0) {
                                        value = Math.min(
                                            value,
                                            duration
                                        );
                                    }

                                    setEndTime(
                                        Number(value.toFixed(1))
                                    );
                                }}
                            />

                        </div>

                        {/* Ringtone Name */}

                        <div className="controlItem">

                            <label>
                                Ringtone Name
                            </label>

                            <input
                                type="text"
                                value={ringtoneName}
                                placeholder="My-Ringtone"
                                maxLength={100}
                                onChange={(e) =>
                                    setRingtoneName(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* Volume */}

                        <div className="controlItem">

                            <label>
                                Volume
                            </label>

                            <select
                                value={volume}
                                onChange={(e) =>
                                    setVolume(
                                        Number(e.target.value)
                                    )
                                }
                            >

                                <option value="0.5">
                                    50%
                                </option>

                                <option value="0.75">
                                    75%
                                </option>

                                <option value="1">
                                    100%
                                </option>

                                <option value="1.25">
                                    125%
                                </option>

                                <option value="1.5">
                                    150%
                                </option>

                            </select>

                        </div>

                        {/* Fade In */}

                        <div className="controlItem checkboxItem">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={fadeIn}
                                    onChange={(e) =>
                                        setFadeIn(
                                            e.target.checked
                                        )
                                    }
                                />

                                Fade In

                            </label>

                        </div>

                        {/* Fade Out */}

                        <div className="controlItem checkboxItem">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={fadeOut}
                                    onChange={(e) =>
                                        setFadeOut(
                                            e.target.checked
                                        )
                                    }
                                />

                                Fade Out

                            </label>

                        </div>

                    </div>

                )}

                {/* --------------------------------------------------
            Create Button
        -------------------------------------------------- */}

                {audioFile && (

                    <div className="ringtone-btn-container">

                        <button
                            className="ringtone-create-btn"
                            onClick={createRingtone}
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Ringtone..."
                                : "Create Ringtone"}

                        </button>

                    </div>

                )}

                {/* --------------------------------------------------
            Status
        -------------------------------------------------- */}

                {status && (
                    <div className="mediafilestatuscontaner">

                        <div className="mediafilestatus">
                            {status}
                        </div>
                    </div>

                )}

                {/* --------------------------------------------------
            Progress
        -------------------------------------------------- */}

                {loading && (

                    <div className="ringtone-progress">

                        <progress
                            value={progress}
                            max="100"
                        />

                        <p>
                            {progress}%
                        </p>

                    </div>

                )}

                {/* --------------------------------------------------
            Result
        -------------------------------------------------- */}

                {ringtoneUrl && (

                    <div className="ringtoneResult">

                        <h3>
                            Your Ringtone
                        </h3>

                        <audio
                            src={ringtoneUrl}
                            controls
                            className="ringtoneResultAudio"
                        />

                        <div className="ringtone-download-container">

                            <a
                                href={ringtoneUrl}
                                download={
                                    `${ringtoneName.trim() || "My-Ringtone"}.mp3`
                                }
                                className="ringtone-download-link"
                            >
                                Download Ringtone
                            </a>

                        </div>

                    </div>

                )}



                {ringtoneFile && (

                    <>

                        <p className="saveToTitle" style={{ marginTop: "20px", textAlign: "center", color: "white" }}> Save File To...</p>

                        <div className="saveTo">
                            <SaveToGoogleDrive file={ringtoneFile} />
                            <SaveToDropbox file={ringtoneFile} />
                        </div>

                    </>

                )}

                

            </div>

            <div className="ringtone-seo-content">

    <h2>Free Ringtone Maker Online</h2>

    <p>
        Create your own custom ringtones with our free ringtone maker online.
        This easy-to-use ringtone generator lets you quickly cut, trim and
        customize your favorite audio files directly in your browser. Whether
        you want to create a ringtone from an MP3 song, a short music clip,
        a voice recording or another supported audio file, you can make your
        own ringtone in just a few simple steps.
    </p>

    <p>
        Our online ringtone maker is designed to make audio editing simple
        and fast. You do not need complicated audio editing software or
        professional editing skills. Upload your audio file, select the
        portion you want to use, adjust the ringtone length and create your
        custom ringtone instantly. The tool works directly in your browser,
        making it convenient when you want to make a ringtone online from
        your computer or mobile device.
    </p>


    <h2>Fast and Easy Ringtone Generator</h2>

    <p>
        Looking for a fast ringtone generator? FileUnivers makes it easy to
        turn your favorite audio into a personalized ringtone. You can use
        the audio cut and audio trim controls to select exactly the part of
        the song you want. The interactive waveform editor makes selecting
        your ringtone even easier. Simply drag the selection handles to
        choose the starting and ending points of your audio.
    </p>

    <p>
        You can also move the selected audio section by dragging the complete
        selection. This gives you precise control over which part of your
        song becomes your ringtone. The selected ringtone duration is shown
        clearly so you can quickly check the start time, end time and total
        length before creating the final file.
    </p>


    <h2>Audio Cut and Audio Trim Online</h2>

    <p>
        With our online audio cutter and ringtone maker, you can easily cut
        unwanted parts from an audio file and keep only the section you need.
        The audio trim feature allows you to select a specific portion of
        your audio without installing additional software. You can enter the
        start and end time manually or use the draggable waveform controls
        for a faster and more convenient editing experience.
    </p>

    <p>
        The ringtone generator is useful for creating short music ringtones,
        notification sounds, voice clips and other custom audio files.
        You can preview your selected audio before creating the final
        ringtone, helping you make sure that the selected portion is exactly
        what you want.
    </p>


    <h2>Drag and Drop Audio Upload</h2>

    <p>
        Uploading an audio file is quick and simple. You can use the normal
        file picker or simply drag and drop your audio file into the upload
        area. Drag and drop makes the ringtone creation process faster,
        especially when you are working with multiple audio files on your
        computer.
    </p>

    <p>
        The ringtone maker supports commonly used audio formats such as MP3,
        WAV, M4A, AAC, OGG, FLAC and OPUS. Once your file is uploaded, the
        waveform editor can be used to select the exact portion you want to
        convert into a ringtone.
    </p>


    <h2>Use Google Drive and Dropbox</h2>

    <p>
        You can also upload your audio files from cloud storage. If your
        audio file is stored in Google Drive or Dropbox, you can use the
        available cloud upload options instead of downloading the file to
        your computer first. This makes it easier to create a ringtone from
        audio files that you already have stored online.
    </p>

    <p>
        After creating your ringtone, you can save the generated audio file
        to supported cloud storage options such as Google Drive or Dropbox.
        This gives you a convenient way to keep your custom ringtone available
        without having to manage the file manually.
    </p>


    <h2>Create a Free Custom Ringtone</h2>

    <p>
        FileUnivers provides a free ringtone maker for users who want to
        create custom ringtones without complicated software. You can trim
        your favorite audio, adjust the volume and optionally add fade-in or
        fade-out effects to create a smoother ringtone. The simple interface
        lets you control the important audio settings before generating your
        final file.
    </p>

    <p>
        Whether you need an MP3 ringtone maker, an online audio cutter, an
        audio trim tool or a simple ringtone generator, FileUnivers provides
        these features in one convenient place. You can create a ringtone
        online without installing a separate desktop application.
    </p>


    <h2>Secure Online Ringtone Maker</h2>

    <p>
        Your audio editing experience should be simple and secure. FileUnivers
        is designed to process supported audio files directly in your browser
        using modern web technologies. This allows you to edit and create
        ringtones online without sending your audio to a traditional
        server-based audio editing service for processing.
    </p>

    <p>
        For the best experience, use a modern browser and a stable device
        when working with larger audio files. The ringtone maker provides a
        simple workflow from uploading your audio to selecting the desired
        section and creating your final ringtone.
    </p>


    <h2>How to Make a Ringtone Online</h2>

    <ol>
        <li>
            Upload your audio file using the file picker or drag and drop it
            into the upload area.
        </li>

        <li>
            You can also select an audio file from Google Drive or Dropbox.
        </li>

        <li>
            Use the waveform editor to choose the part of the audio you want
            to use as your ringtone.
        </li>

        <li>
            Drag the start and end handles or enter the time manually for
            more precise audio trimming.
        </li>

        <li>
            Adjust the volume and optionally enable fade-in or fade-out
            effects.
        </li>

        <li>
            Preview your selected ringtone and make any necessary changes.
        </li>

        <li>
            Click <strong>Create Ringtone</strong> to generate your custom
            audio file.
        </li>

        <li>
            Download the ringtone or save it to Google Drive or Dropbox.
        </li>
    </ol>


    <h2>Why Use Our Ringtone Maker?</h2>

    <p>
        Our free ringtone maker online combines a simple interface with
        useful audio editing features. You can quickly cut and trim audio,
        select a precise section using the waveform, preview your selection
        and generate a custom ringtone without complicated software. The
        drag and drop upload option and Google Drive and Dropbox integration
        make the process even more convenient.
    </p>

    <p>
        Start creating your custom ringtone today with the FileUnivers
        ringtone maker and enjoy a fast, simple and convenient way to turn
        your favorite audio into a personalized ringtone.
    </p>

</div>
        </>
    );
}