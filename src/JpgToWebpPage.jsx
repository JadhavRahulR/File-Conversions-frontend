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

export default function JpgToWebpPage() {
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
            const jpgFiles = selected.filter(
                (f) => f.type === "image/jpeg"
            );
            if (!jpgFiles.length) return;

            setFiles((p) => [...p, ...jpgFiles]);
            setPreviewUrl(URL.createObjectURL(jpgFiles[0]));
            return;
        }

        if (input instanceof File) {
            if (input.type !== "image/jpeg") return;
            setFiles((p) => [...p, input]);
            setPreviewUrl(URL.createObjectURL(input));
        }
    };

    const handleExternalFilePick = async (picked) => {
        const pickedFiles = Array.isArray(picked) ? picked : [picked];
        const normalized = [];

        for (const item of pickedFiles) {
            if (item instanceof File) {
                if (/\.(jpg|jpeg)$/i.test(item.name)) normalized.push(item);
                continue;
            }

            if (item?.url || item?.downloadUrl) {
                const res = await fetch(item.url || item.downloadUrl);
                const blob = await res.blob();
                if (!blob.type.includes("jpeg")) continue;

                normalized.push(
                    new File([blob], item.name || "image.jpg", {
                        type: "image/jpeg",
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
                            zip.file(`${name}.webp`, blob);
                        } else {
                            const outFile = new File([blob], `${name}.webp`, {
                                type: "image/webp",
                            });

                            setConvertedFile(outFile);
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = outFile.name;
                            a.click();
                        }
                        resolve();
                    },
                    "image/webp",
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
        const zipFile = new File([zipBlob], "jpg-to-webp.zip", {
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
                <title>JPG To WEBP | Convert Multiple JPG To WEBP Free Online</title>

                <meta
                    name="description"
                    content="Convert JPG or JPEG images to WEBP online for free. Easily change JPG to WEBP with high compression, batch conversion, and instant download. No signup required."
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/jpgtowebp"
                />

                <meta name="robots" content="index, follow" />

                <meta
                    name="keywords"
                    content="jpg to webp, jpeg to webp, convert jpg to webp online, jpg to webp converter, jpg to webp free, jpg image converter, batch jpg to webp, compress jpg to webp"
                />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>JPG To WEBP – Multiple JPG & JPEG Images To WEBP Online</h1>
                <p className="intro-paragraph">
                    FileUnivers’s JPG to WEBP converter is a powerful online tool that allows you to convert JPG or JPEG images to WEBP format instantly. Designed for speed, quality, and compression efficiency, this tool helps you significantly reduce image file size while preserving sharp visual quality. Whether you are optimizing images for websites, improving page load speed, or saving storage space, you can convert single or multiple JPG images to WEBP directly in your browser — with no signup, no installation, and complete privacy.
                </p>
            </div>

            <div className="imgtoimgcontainer">
                <div className="tool-container">
                    <h2>JPG To WEBP Converter</h2>

                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg"
                        onChange={handleDropzoneFile}
                    />

                    <DropzoneInput
                        accept="image/jpeg"
                        multiple
                        onFileAccepted={handleDropzoneFile}
                    />

                    <div className="external-inputs">
                        <DriveFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            allowedTypes={[".jpg", ".jpeg"]}
                        />
                        <DropboxFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            extensions={[".jpg", ".jpeg"]}
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
                        {processing ? "Converting..." : "Convert JPG to WEBP"}
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
                    Convert JPG to WEBP Online – Fast, Free & High Compression
                </h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s JPG to WEBP converter is a modern and efficient online tool designed
                    to help you convert JPG or JPEG images into the highly optimized WEBP format
                    instantly. Whether you are optimizing images for websites, improving page loading
                    speed, or reducing storage usage, this tool allows you to convert files directly
                    in your browser without uploading them to any server. All conversions happen
                    locally on your device, ensuring complete privacy, security, and fast performance.
                </p>

                <div className="resizeimg-img">
                    <img src="jpg.png" alt="JPG Image" className="ConverterImgtwo" />
                    <p style={{ textAlign: "center" }}>JPG Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    JPG and JPEG images are among the most commonly used image formats in the world.
                    They are widely supported and ideal for photographs, but they are not always the
                    most efficient format for modern web performance. WEBP is a next-generation image
                    format that provides significantly better compression while maintaining excellent
                    visual quality. By converting JPG to WEBP, you can dramatically reduce image file
                    size without noticeably affecting appearance.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert JPG to WEBP?</h3>

                <p className="pngtojpg-paragraph">
                    There are many practical reasons to convert JPG images to WEBP format. One of the
                    biggest advantages is file size reduction. WEBP images are typically 25–35% smaller
                    than JPG images of the same quality. This makes WEBP ideal for websites, blogs,
                    e-commerce stores, and mobile apps where faster loading speed directly improves
                    user experience and search engine rankings.
                </p>

                <p className="pngtojpg-paragraph">
                    WEBP also supports advanced compression techniques that preserve fine image
                    details while removing unnecessary data. If you manage a website with a large
                    number of images, converting JPG to WEBP can significantly reduce bandwidth usage
                    and hosting costs while improving overall performance.
                </p>

                <h3 className="pngtojpg-subheading">Convert Multiple JPG Files at Once</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers supports batch conversion, allowing you to convert multiple JPG or JPEG
                    images to WEBP in one go. This is especially useful for web developers, designers,
                    photographers, and content creators who work with large image libraries. Instead of
                    converting images one by one, you can upload multiple JPG files and download all
                    converted WEBP images together in a single ZIP archive.
                </p>

                <p className="pngtojpg-paragraph">
                    Since the JPG to WEBP conversion runs entirely in your browser using modern web
                    technologies like JavaScript and Canvas, there is no hard limit on the number of
                    images you can convert. The actual limit depends on your device’s memory and
                    performance. For a smooth experience, we recommend staying within the suggested
                    file size limits listed below.
                </p>

                <h3 className="pngtojpg-subheading">Recommended File Size Limits by Device</h3>

                <div className="pngtojpg-table-wrapper">
                    <table className="pngtojpg-table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Total JPG Size (together)</th>
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
                    conversion. Each JPG image must be decoded, processed on a canvas, and re-encoded
                    into WEBP format, which requires memory and processing power. Staying within these
                    limits ensures fast and stable conversions.
                </p>

                <h3 className="pngtojpg-subheading">
                    Safe, Private, and Browser-Based JPG to WEBP Conversion
                </h3>

                <p className="pngtojpg-paragraph">
                    Privacy is a core advantage of FileUnivers’s JPG to WEBP converter. Your images are
                    never uploaded to any server. All conversions take place locally in your browser,
                    which means your files remain on your device at all times. This makes the tool ideal
                    for converting personal, confidential, or professional images without privacy
                    concerns.
                </p>

                <p className="pngtojpg-paragraph">
                    Because the tool is browser-based, there is no need to install any software or
                    create an account. You can use the JPG to WEBP converter on Windows, macOS, Linux,
                    Android, and iOS devices. Any modern browser is enough to start converting images
                    instantly.
                </p>

                <h3 className="pngtojpg-subheading">
                    High Compression with Excellent Image Quality
                </h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers allows you to control the WEBP compression level, giving you the
                    flexibility to balance image quality and file size. This is especially useful for
                    optimizing images for websites where smaller file sizes improve loading speed
                    without noticeable quality loss.
                </p>

                <p className="pngtojpg-paragraph">
                    Whether you need to convert a single JPG image or hundreds of files in bulk,
                    FileUnivers provides a fast, reliable, and completely free solution. With no limits,
                    no watermarks, and no registration required, it is the perfect tool for modern image
                    optimization.
                </p>

                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Is this JPG to WEBP converter free to use?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the JPG to WEBP converter is completely free. You can convert unlimited JPG
                            or JPEG images to WEBP without watermarks, fees, or registration.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Are my JPG images uploaded to a server?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. All conversions happen locally in your browser. Your images are never
                            uploaded, stored, or shared with any server.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            How much smaller are WEBP images compared to JPG?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            WEBP images are typically 25–35% smaller than JPG images at similar visual
                            quality, making them ideal for web optimization.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I convert multiple JPG files at once?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. FileUnivers supports batch conversion, allowing you to convert multiple JPG
                            or JPEG images to WEBP in a single process.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Does WEBP work on all browsers?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Most modern browsers fully support WEBP. For older software or unsupported
                            platforms, you can always convert WEBP images back to JPG or PNG.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Do I need to install any software?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No installation is required. The JPG to WEBP converter works entirely online in
                            your browser.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}