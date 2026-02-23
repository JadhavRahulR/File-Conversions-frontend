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

export default function JpgToPngPage() {
    const [files, setFiles] = useState([]);
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
        const zipFile = new File([zipBlob], "jpg-to-png.zip", {
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
                <title>JPG To PNG | Convert Multiple JPG Images To PNG Free </title>
                <meta name="description" content="Convert JPG or JPEG images to PNG online for free. Easily change JPG to PNG with high quality, transparent background support, batch conversion, and instant download. No signup required." />
                <link rel="canonical" href="https://fileunivers.com/jpgtopng" />
                <meta name="robots" content="index, follow" />

                <meta name="keywords" content="jpg to png, jpeg to png, convert jpg to png online, jpg to png converter, jpg to png free, jpg image converter, jpeg to png converter, batch jpg to png" />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>JPG to PNG Converter – Convert Multiple JPG Images to PNG Online for Free</h1>
                <p className="intro-paragraph">
                    Convert JPG or JPEG images to high-quality PNG format instantly using FileUnivers’s
                    free JPG to PNG converter. This online tool works directly in your browser, allowing
                    you to convert single or multiple JPG images to PNG without uploading files to any
                    server. The conversion process is fast, secure, and completely private, producing
                    lossless PNG images that are perfect for editing, design work, transparent
                    backgrounds, and professional use.
                </p>
            </div>

            <div className="imgtoimgcontainer">
                <div className="tool-container">
                    <h2>JPG To PNG Converter</h2>

                    <input type="file" multiple accept=".jpg,.jpeg" onChange={handleDropzoneFile} />

                    <DropzoneInput
                        accept="image/jpeg"
                        multiple
                        onFileAccepted={handleDropzoneFile}
                    />

                    <div className="external-inputs">
                        <DriveFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} allowedTypes={[".jpg", ".jpeg"]} />
                        <DropboxFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} extensions={[".jpg", ".jpeg"]} />
                    </div>

                    {previewUrl && (
                        <img src={previewUrl} alt="preview" className="image-preview-box" />
                    )}

                    <button className="primary-btn" onClick={convertImages} disabled={processing}>
                        {processing ? "Converting..." : "Convert JPG to PNG"}
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
                    Convert JPG to PNG Online – Fast, Free & Lossless Quality
                </h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s JPG to PNG converter is a powerful and easy-to-use online tool
                    that allows you to convert JPG or JPEG images into high-quality PNG format
                    instantly. Whether you are working with photographs, screenshots, or design
                    assets, this tool helps you convert images directly in your browser without
                    uploading them to any server. All processing happens locally on your device,
                    ensuring maximum privacy, security, and speed.
                </p>

                <div className="resizeimg-img">
                    <img src="jpg.png" alt="JPG to PNG Example" className="ConverterImgtwo" />
                    <p style={{ textAlign: "center" }}>JPG Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    JPG images are widely used due to their small file size and compatibility
                    across all devices. However, JPG uses lossy compression, which can reduce
                    image quality and does not support transparency. PNG, on the other hand, is
                    a lossless image format that preserves every pixel and supports transparent
                    backgrounds. By converting JPG to PNG, you can improve image clarity and
                    make files suitable for professional design, editing, and web graphics.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert JPG to PNG?</h3>

                <p className="pngtojpg-paragraph">
                    There are many practical reasons to convert JPG images to PNG format. JPG is
                    best suited for photographs, but when you need sharp edges, text clarity,
                    transparency, or repeated editing, PNG is the better option. Designers often
                    convert JPG to PNG when preparing images for logos, UI elements, icons, and
                    presentations where quality matters more than file size.
                </p>

                <p className="pngtojpg-paragraph">
                    Converting JPG to PNG is also useful when editing images multiple times.
                    Since PNG is lossless, it prevents further quality degradation during
                    repeated saves. This makes PNG ideal for workflows involving image editing,
                    background removal, or graphic overlays.
                </p>

                <h3 className="pngtojpg-subheading">Batch Convert JPG Images to PNG</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers supports batch conversion, allowing you to convert multiple JPG
                    or JPEG images to PNG in one go. This feature is especially helpful for
                    designers, developers, photographers, and content creators who work with
                    large collections of images. Instead of converting files one by one, you
                    can upload multiple JPG images and download all converted PNG files together
                    in a single ZIP archive.
                </p>

                <p className="pngtojpg-paragraph">
                    Because the conversion happens entirely inside your browser using modern
                    JavaScript and Canvas technology, there is no fixed limit on the number of
                    images you can convert. The actual limit depends on your device’s memory and
                    performance. To avoid slowdowns or crashes, it is recommended to stay within
                    the suggested file size limits below.
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
                    Larger JPG images require more memory because each image must be decoded,
                    processed on a canvas, and re-encoded as a PNG file. Staying within these
                    limits ensures smooth performance and prevents your browser from becoming
                    slow or unresponsive during conversion.
                </p>

                <h3 className="pngtojpg-subheading">
                    Safe, Private, and Browser-Based JPG to PNG Conversion
                </h3>

                <p className="pngtojpg-paragraph">
                    Privacy is one of the biggest advantages of using FileUnivers’s JPG to PNG
                    converter. Your images are never uploaded to any server. Everything happens
                    locally in your browser, which means your files stay on your device at all
                    times. This makes the tool ideal for converting personal, confidential, or
                    work-related images without any privacy concerns.
                </p>

                <p className="pngtojpg-paragraph">
                    Since the tool is fully browser-based, there is no need to install any
                    software or create an account. You can use the JPG to PNG converter on
                    Windows, macOS, Linux, Android, and iOS devices. Any modern web browser is
                    sufficient to get started instantly.
                </p>

                <h3 className="pngtojpg-subheading">
                    High-Quality PNG Output with No Compression Loss
                </h3>

                <p className="pngtojpg-paragraph">
                    Unlike JPG, PNG is a lossless format, which means there is no quality slider
                    or compression loss during conversion. FileUnivers always produces the
                    highest possible PNG quality by preserving all image details. This makes
                    the converted PNG files perfect for further editing, printing, or use in
                    professional design projects.
                </p>

                <p className="pngtojpg-paragraph">
                    Whether you need to convert a single JPG image to PNG or process dozens of
                    files in bulk, FileUnivers provides a fast, reliable, and completely free
                    solution. With no limits, no watermarks, and no registration required, it is
                    the perfect tool for everyday image conversion needs.
                </p>

                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Is this JPG to PNG converter free to use?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the JPG to PNG converter is completely free. You can convert unlimited
                            JPG or JPEG images to PNG without any cost, watermarks, or registration.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Are my images uploaded to a server?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. All conversions happen locally in your browser. Your images are never
                            uploaded or stored on any server, ensuring full privacy.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Does PNG support transparency?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. PNG supports transparent backgrounds. If your JPG image has a solid
                            background, it will remain solid after conversion, but PNG allows future
                            transparency edits.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Will image quality improve after conversion?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            PNG conversion preserves image quality but cannot restore details already
                            lost in JPG compression. However, it prevents further quality loss during
                            editing.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I use this tool on mobile devices?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the JPG to PNG converter works on mobile phones, tablets, laptops,
                            and desktops with any modern web browser.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}