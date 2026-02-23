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

export default function WebpToPngPage() {
    const [files, setFiles] = useState([]);
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
                canvas.toBlob((blob) => {
                    const name = file.name.replace(/\.[^/.]+$/, "");

                    if (zip) {
                        zip.file(`${name}.png`, blob);
                    } else {
                        const outFile = new File([blob], `${name}.png`, {
                            type: "image/png",
                        });

                        setConvertedFile(outFile);
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = outFile.name;
                        a.click();
                    }
                    resolve();
                }, "image/png");
            });
        };

        if (files.length === 1) {
            await processOne(files[0]);
            setProcessing(false);
            return;
        }

        const zip = new JSZip();
        for (const f of files) await processOne(f, zip);

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFile = new File([zipBlob], "webp-to-png.zip", {
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
                <title>WEBP To PNG | Convert WEBP To PNG Free Online</title>

                <meta
                    name="description"
                    content="Convert WEBP images to PNG online for free. Easily change WEBP to PNG with high quality, transparent background support, batch conversion, and instant download. No signup required."
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/webptopng"
                />

                <meta name="robots" content="index, follow" />

                <meta
                    name="keywords"
                    content="webp to png, convert webp to png online, webp to png converter, webp to png free, webp image converter, batch webp to png, lossless webp to png"
                />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>WEBP To PNG Converter – Convert WEBP Images to PNG Online for Free</h1>

                <p className="intro-paragraph">
                    Convert WEBP images to high-quality PNG format instantly using FileUnivers’s
                    free WEBP to PNG converter. This online tool runs directly in your browser,
                    allowing you to convert single or multiple WEBP images to PNG without uploading
                    files to any server. The conversion process is fast, secure, and fully private,
                    producing lossless PNG images that are ideal for image editing, transparent
                    backgrounds, graphic design, and professional use.
                </p>
            </div>

            <div className="imgtoimgcontainer">
                <div className="tool-container">
                    <h2>WEBP To PNG Converter</h2>

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

                    <button
                        className="primary-btn"
                        onClick={convertImages}
                        disabled={processing}
                    >
                        {processing ? "Converting..." : "Convert WEBP to PNG"}
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
                    Convert WEBP to PNG Online – Fast, Free & Lossless Image Conversion
                </h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s WEBP to PNG converter is a fast, reliable, and easy-to-use online
                    tool that lets you convert WEBP images into high-quality PNG format instantly.
                    Whether you are working with website images, downloaded assets, screenshots,
                    or design files, this tool allows you to convert WEBP images directly in your
                    browser without uploading them to any server. All processing happens locally
                    on your device, ensuring complete privacy, security, and excellent performance.
                </p>

                <div className="resizeimg-img">
                    <img src="webp.png" alt="WEBP to PNG Example" className="ConverterImgtwo" />
                    <p style={{ textAlign: "center" }}>WEBP Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    WEBP is a modern image format developed to provide smaller file sizes while
                    maintaining good visual quality. It is widely used on websites to improve
                    loading speed and performance. However, WEBP is not fully supported by all
                    image editors, design tools, or operating systems. PNG, on the other hand,
                    is a universally supported, lossless image format that preserves image
                    quality and supports transparency, making it ideal for editing, printing,
                    and professional design workflows.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert WEBP to PNG?</h3>

                <p className="pngtojpg-paragraph">
                    There are many practical reasons to convert WEBP images to PNG format. While
                    WEBP is excellent for web performance, it can cause compatibility issues when
                    opening images in older software, graphic design tools, or desktop applications.
                    PNG is supported almost everywhere, making it a safer and more flexible choice
                    for long-term use.
                </p>

                <p className="pngtojpg-paragraph">
                    Designers and content creators often convert WEBP to PNG when they need to
                    edit images in software like Photoshop, GIMP, or other design tools that may
                    not fully support WEBP. PNG also supports transparent backgrounds, which makes
                    it perfect for logos, icons, overlays, UI elements, and marketing graphics.
                </p>

                <h3 className="pngtojpg-subheading">Batch Convert WEBP Images to PNG</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers allows you to batch convert multiple WEBP images to PNG in a single
                    operation. This feature is especially useful for web developers, designers,
                    and content managers who need to convert large collections of images quickly.
                    Instead of converting files one by one, you can select multiple WEBP images
                    and download all converted PNG files together in a single ZIP archive.
                </p>

                <p className="pngtojpg-paragraph">
                    Because the WEBP to PNG conversion runs entirely in your browser using modern
                    JavaScript and Canvas technology, there are no server-side limits on how many
                    files you can convert. The only limitation is your device’s memory and
                    performance. To ensure smooth and stable operation, we recommend following
                    the suggested file size limits below.
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
                                <td>40–80 MB</td>
                                <td>10–20 images</td>
                            </tr>
                            <tr>
                                <td>Laptop (8 GB RAM)</td>
                                <td>150–250 MB</td>
                                <td>30–50 images</td>
                            </tr>
                            <tr>
                                <td>Desktop (16 GB RAM)</td>
                                <td>300–500 MB</td>
                                <td>60–100 images</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="pngtojpg-paragraph">
                    Although WEBP files are usually smaller than PNG, converting many images at
                    once still requires memory because each image must be decoded, processed,
                    and re-encoded. Staying within these recommended limits helps prevent browser
                    slowdowns, crashes, or unresponsive tabs during conversion.
                </p>

                <h3 className="pngtojpg-subheading">
                    Safe, Private, and Browser-Based WEBP to PNG Conversion
                </h3>

                <p className="pngtojpg-paragraph">
                    Privacy is a core feature of FileUnivers’s WEBP to PNG converter. Your images
                    are never uploaded, stored, or shared with any server. All conversion happens
                    locally in your browser, which means your files never leave your device.
                    This makes the tool ideal for converting personal, confidential, or work-related
                    images without any security concerns.
                </p>

                <p className="pngtojpg-paragraph">
                    Since the tool is fully browser-based, there is no need to install software,
                    create an account, or sign in. You can use the WEBP to PNG converter on Windows,
                    macOS, Linux, Android, and iOS devices. Any modern browser such as Chrome,
                    Firefox, Edge, or Safari is sufficient to start converting instantly.
                </p>

                <h3 className="pngtojpg-subheading">
                    High-Quality PNG Output with No Quality Loss
                </h3>

                <p className="pngtojpg-paragraph">
                    PNG is a lossless image format, which means no image data is discarded during
                    conversion. FileUnivers preserves the highest possible image quality when
                    converting WEBP to PNG. This ensures sharp edges, accurate colors, and perfect
                    detail retention, making the converted images suitable for professional design,
                    printing, and further editing.
                </p>

                <p className="pngtojpg-paragraph">
                    Whether you need to convert a single WEBP image to PNG or process dozens of
                    images in bulk, FileUnivers provides a fast, secure, and completely free
                    solution. There are no watermarks, no hidden limits, and no registration
                    required — just simple and reliable image conversion.
                </p>

                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Is this WEBP to PNG converter free to use?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. The WEBP to PNG converter is completely free to use with no limits,
                            watermarks, or registration required.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Are my WEBP images uploaded to a server?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. All conversions happen locally in your browser. Your images are never
                            uploaded or stored anywhere.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Does PNG support transparent backgrounds?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. PNG fully supports transparency. If your WEBP image contains
                            transparency, it will be preserved in the converted PNG file.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Will the image quality change after conversion?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            PNG conversion is lossless, so no additional quality is lost. The PNG
                            image will preserve the visual quality of the original WEBP file.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I convert WEBP to PNG on mobile?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. The WEBP to PNG converter works smoothly on mobile phones, tablets,
                            laptops, and desktops using any modern web browser.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}