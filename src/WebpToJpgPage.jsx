import { useState, useEffect } from "react";
import JSZip from "jszip";
import "./imgtoimg.css";

import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";

import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

export default function WebpToJpgPage() {
    const [files, setFiles] = useState([]);
    const [quality, setQuality] = useState(0.9);
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [convertedFile, setConvertedFile] = useState(null);
    const [status, setStatus] = useState("");

    /* ================= file handlers ================= */

    const handleDropzoneFile = (input) => {
        if (input?.target?.files) {
            const selected = Array.from(input.target.files);
            const webpFiles = selected.filter(
                (f) => f.type === "image/webp"
            );
            if (!webpFiles.length) return;

            setFiles((p) => [...p, ...webpFiles]);
            setPreviewUrl(URL.createObjectURL(webpFiles[0]));
            return;
        }

        if (input instanceof File) {
            if (input.type !== "image/webp") return;
            setFiles((p) => [...p, input]);
            setPreviewUrl(URL.createObjectURL(input));
        }
    };

    const handleExternalFilePick = async (picked) => {
        const pickedFiles = Array.isArray(picked) ? picked : [picked];
        const normalized = [];

        for (const item of pickedFiles) {
            if (item instanceof File) {
                if (/\.webp$/i.test(item.name)) normalized.push(item);
                continue;
            }

            if (item?.url || item?.downloadUrl) {
                const res = await fetch(item.url || item.downloadUrl);
                const blob = await res.blob();
                if (!blob.type.includes("webp")) continue;

                normalized.push(
                    new File([blob], item.name || "image.webp", {
                        type: "image/webp",
                    })
                );
            }
        }

        if (!normalized.length) return;
        setFiles((p) => [...p, ...normalized]);
        setPreviewUrl(URL.createObjectURL(normalized[0]));
    };

    /* ================= image loader ================= */

    const loadImage = (file) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });

    /* ================= convert ================= */

    const convertImages = async () => {
        if (!files.length) return;
        setProcessing(true);

        const processOne = async (file, zip = null) => {
            const img = await loadImage(file);

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);

            return new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        const name = file.name.replace(/\.[^/.]+$/, "");

                        if (zip) {
                            zip.file(`${name}.jpg`, blob);
                        } else {
                            const outFile = new File([blob], `${name}.jpg`, {
                                type: "image/jpeg",
                            });

                            setConvertedFile(outFile);
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = outFile.name;
                            a.click();
                        }
                        resolve();
                    },
                    "image/jpeg",
                    quality
                );
            });
        };

        // single file
        if (files.length === 1) {
            await processOne(files[0]);
            setProcessing(false);
            return;
        }

        // multiple files → ZIP
        const zip = new JSZip();
        for (const f of files) await processOne(f, zip);

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFile = new File([zipBlob], "webp-to-jpg.zip", {
            type: "application/zip",
        });

        setConvertedFile(zipFile);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipFile.name;
        a.click();

        setProcessing(false);
    };

    useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [
        previewUrl,
    ]);

    /* ================= UI ================= */

    return (
        <>
            <Helmet>
                <title>WEBP To JPG | Convert Multiple WEBP To JPG Free Online</title>

                <meta
                    name="description"
                    content="Convert WEBP images to JPG or JPEG online for free. Easily change WEBP to JPG with high quality, batch conversion, and instant download. No signup required."
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/webptojpg"
                />

                <meta name="robots" content="index, follow" />

                <meta
                    name="keywords"
                    content="webp to jpg, webp to jpeg, convert webp to jpg online, webp to jpg converter, webp to jpg free, webp image converter, batch webp to jpg"
                />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>WEBP To JPG - Convert Multiple WEBP Images To JPG Free Online</h1>
                <p className="intro-paragraph">
                    FileUnivers’s WEBP to JPG converter makes it easy to convert WEBP images into widely supported JPG or JPEG format online. If you are facing compatibility issues with WEBP images on older devices, software, or platforms, this tool provides a fast and reliable solution. Convert single or multiple WEBP files to high-quality JPG images instantly, directly in your browser, without uploading files to any server — ensuring maximum security, privacy, and ease of use.
                </p>
            </div>

            <div className="imgtoimgcontainer">
                <div className="tool-container">
                    <h2>WEBP To JPG Converter</h2>

                    <input
                        type="file"
                        multiple
                        accept=".webp"
                        onChange={handleDropzoneFile}
                    />

                    <DropzoneInput
                        accept="image/webp"
                        multiple
                        onFileAccepted={handleDropzoneFile}
                    />

                    <div className="external-inputs">
                        <DriveFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            allowedTypes={[".webp"]}
                        />
                        <DropboxFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            extensions={[".webp"]}
                        />
                    </div>

                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="image-preview-box"
                        />
                    )}

                    <div className="controls">
                        <label>
                            Quality ({Math.round(quality * 100)}%)
                            <input
                                type="range"
                                min="0.6"
                                max="1"
                                step="0.01"
                                value={quality}
                                onChange={(e) => setQuality(+e.target.value)}
                            />
                        </label>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={convertImages}
                        disabled={processing}
                    >
                        {processing ? "Converting..." : "Convert WEBP to JPG"}
                    </button>

                    {convertedFile && (
                        <div className="save-actions">
                            <SaveToGoogleDrive file={convertedFile} />
                            <SaveToDropbox file={convertedFile} />
                        </div>
                    )}
                </div>
            </div>

            <section className="pngtojpg-content">

                <h2 className="pngtojpg-heading">
                    Convert WEBP to JPG Online – Fast, Free & High Quality
                </h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s WEBP to JPG converter is a powerful online tool that helps you convert
                    WEBP images to JPG or JPEG format instantly. Whether you are working with images
                    downloaded from websites, modern web graphics, or compressed assets, this tool
                    allows you to convert files directly in your browser without uploading them to any
                    server. The entire conversion process happens locally on your device, ensuring
                    maximum privacy, speed, and security.
                </p>

                <div className="resizeimg-img">
                    <img src="webp.png" alt="WEBP Image" className="ConverterImgtwo" />
                    <p style={{ textAlign: "center" }}>WEBP Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    WEBP is a modern image format designed to reduce file size while maintaining good
                    visual quality. It is widely used on websites to improve page loading speed.
                    However, WEBP is not always supported by older software, image editors, email
                    clients, or certain platforms. JPG and JPEG formats, on the other hand, are
                    universally supported and work seamlessly across all devices, applications, and
                    operating systems. By converting WEBP to JPG, you ensure maximum compatibility
                    without sacrificing image clarity.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert WEBP to JPG?</h3>

                <p className="pngtojpg-paragraph">
                    There are many practical reasons to convert WEBP images to JPG format. While WEBP
                    is excellent for web performance, it can cause compatibility issues when opening
                    images in older photo viewers, editing software, or office applications. JPG is
                    one of the most widely supported image formats and is accepted everywhere — from
                    social media platforms and email attachments to printing services and design tools.
                </p>

                <p className="pngtojpg-paragraph">
                    Converting WEBP to JPG is especially useful if you need to edit images in software
                    that does not fully support WEBP. JPG files are also easier to share with clients,
                    colleagues, and friends who may not be familiar with newer image formats.
                </p>

                <h3 className="pngtojpg-subheading">Convert Multiple WEBP Files at Once</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers supports batch conversion, allowing you to convert multiple WEBP images
                    to JPG or JPEG in a single process. This feature is ideal for designers, developers,
                    marketers, and content creators who work with large collections of images. Instead
                    of converting files one by one, you can upload multiple WEBP images and download
                    all converted JPG files together in a single ZIP archive.
                </p>

                <p className="pngtojpg-paragraph">
                    Since the converter runs entirely in your browser using modern JavaScript and
                    Canvas technology, there is no fixed limit on the number of files you can upload.
                    The actual limit depends on your device’s memory and performance. For the best
                    experience, we recommend staying within the suggested file size limits listed
                    below.
                </p>

                <h3 className="pngtojpg-subheading">Recommended File Size Limits by Device</h3>

                <div className="pngtojpg-table-wrapper">
                    <table className="pngtojpg-table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Total WEBP Size (together)</th>
                                <th>Approx. Files</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mobile</td>
                                <td>50–100 MB</td>
                                <td>10–20 images</td>
                            </tr>
                            <tr>
                                <td>Laptop (8 GB RAM)</td>
                                <td>200–300 MB</td>
                                <td>30–50 images</td>
                            </tr>
                            <tr>
                                <td>Desktop (16 GB RAM)</td>
                                <td>400–600 MB</td>
                                <td>60–100 images</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="pngtojpg-paragraph">
                    These recommendations help prevent browser slowdowns or memory issues during
                    conversion. Each WEBP image must be decoded, processed on a canvas, and re-encoded
                    as a JPG image, which requires memory and processing power. Staying within these
                    limits ensures smooth and stable performance.
                </p>

                <h3 className="pngtojpg-subheading">
                    Safe, Private, and Browser-Based WEBP to JPG Conversion
                </h3>

                <p className="pngtojpg-paragraph">
                    One of the biggest advantages of using FileUnivers’s WEBP to JPG converter is
                    privacy. Your images are never uploaded to any server. All conversions happen
                    locally in your browser, which means your files remain on your device at all times.
                    This makes the tool perfect for converting personal, confidential, or professional
                    images without any data security concerns.
                </p>

                <p className="pngtojpg-paragraph">
                    Because the tool is fully browser-based, there is no need to install any software
                    or create an account. You can use the WEBP to JPG converter on Windows, macOS,
                    Linux, Android, and iOS devices. Any modern browser is enough to start converting
                    images instantly.
                </p>

                <h3 className="pngtojpg-subheading">
                    High Quality JPG Output with Adjustable Settings
                </h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers allows you to control the output quality of JPG images. You can adjust
                    the compression level to balance file size and visual clarity. This is especially
                    useful when optimizing images for websites, email sharing, or online platforms
                    where smaller file sizes improve loading speed without noticeable quality loss.
                </p>

                <p className="pngtojpg-paragraph">
                    Whether you need to convert a single WEBP image or process hundreds of files in
                    bulk, FileUnivers provides a fast, reliable, and completely free solution. With no
                    limits, no watermarks, and no registration required, it is the perfect tool for
                    everyday image conversion needs.
                </p>

                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Is this WEBP to JPG converter free to use?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, FileUnivers’s WEBP to JPG converter is completely free. You can convert
                            unlimited WEBP images to JPG or JPEG without any cost, watermarks, or
                            registration.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Are my WEBP images uploaded to a server?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. All conversions happen directly in your browser. Your images are never
                            uploaded or stored on any server, ensuring full privacy.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Will converting WEBP to JPG reduce image quality?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            JPG is a compressed format, but FileUnivers allows you to control output
                            quality. By selecting a high-quality setting, you can convert WEBP to JPG with
                            minimal or no visible quality loss.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I convert multiple WEBP files at once?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. Batch conversion is fully supported, allowing you to convert multiple
                            WEBP images to JPG in a single process.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Does JPG support transparency?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. JPG does not support transparent backgrounds. Transparent areas in WEBP
                            images are automatically filled with a background color, usually white.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I use this tool on mobile devices?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the WEBP to JPG converter works on mobile phones, tablets, laptops, and
                            desktops with any modern web browser.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}