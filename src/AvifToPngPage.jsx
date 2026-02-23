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

export default function AvifToPngPage() {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [convertedFile, setConvertedFile] = useState(null);
    const [status, setStatus] = useState("");

    /* ================= FILE INPUT ================= */

    const handleDropzoneFile = (input) => {
        const picked = input?.target?.files
            ? Array.from(input.target.files)
            : input instanceof File
                ? [input]
                : [];

        const avifs = picked.filter(
            (f) => f.type === "image/avif" || /\.avif$/i.test(f.name)
        );

        if (!avifs.length) return;

        setFiles((prev) => [...prev, ...avifs]);
        setPreviewUrl(URL.createObjectURL(avifs[0]));
    };

    const handleExternalFilePick = async (picked) => {
        const list = Array.isArray(picked) ? picked : [picked];
        const out = [];

        for (const item of list) {
            if (item instanceof File) {
                out.push(item);
                continue;
            }

            if (item?.url || item?.downloadUrl) {
                const res = await fetch(item.url || item.downloadUrl);
                const blob = await res.blob();

                if (!blob.type.includes("avif")) continue;

                out.push(
                    new File([blob], item.name || "image.avif", {
                        type: "image/avif",
                    })
                );
            }
        }

        if (!out.length) return;

        setFiles((prev) => [...prev, ...out]);
        setPreviewUrl(URL.createObjectURL(out[0]));
    };

    /* ================= AVIF → PNG ================= */

    async function convertSingleToPng(file) {
        const bitmap = await createImageBitmap(file);

        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/png");
        });
    }

    /* ================= CONVERT ================= */

    const convertImages = async () => {
        if (!files.length) return;
        setProcessing(true);

        const zip = files.length > 1 ? new JSZip() : null;

        for (const file of files) {
            const blob = await convertSingleToPng(file);
            const base = file.name.replace(/\.[^/.]+$/, "");

            if (zip) {
                zip.file(`${base}.png`, blob);
            } else {
                const outFile = new File([blob], `${base}.png`, {
                    type: "image/png",
                });

                setConvertedFile(outFile);

                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = outFile.name;
                a.click();
            }
        }

        if (zip) {
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipFile = new File([zipBlob], "avif-to-png.zip", {
                type: "application/zip",
            });

            setConvertedFile(zipFile);

            const a = document.createElement("a");
            a.href = URL.createObjectURL(zipBlob);
            a.download = zipFile.name;
            a.click();
        }

        setProcessing(false);
    };

    useEffect(() => {
        return () => previewUrl && URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    /* ================= UI ================= */

    return (
        <>
            <Helmet>
                <title>AVIF To PNG | Convert AVIF To PNG Free Online</title>

                <meta
                    name="description"
                    content="Convert AVIF images to PNG online for free. Easily change AVIF to PNG with lossless quality, transparency support, batch conversion, and instant download. No signup required."
                />

                <link
                    rel="canonical"
                    href="https://fileunivers.com/aviftopng"
                />

                <meta name="robots" content="index, follow" />

                <meta
                    name="keywords"
                    content="avif to png, convert avif to png online, avif to png converter, avif to png free, avif image converter, transparent avif to png, batch avif to png"
                />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>AVIF To PNG Converter – Convert AVIF Images To PNG Free</h1>

                <p className="intro-paragraph">
                    Convert AVIF images to high-quality PNG format instantly using FileUnivers’s free
                    AVIF to PNG converter. This tool helps you restore full image compatibility by
                    converting modern AVIF files into universally supported PNG images with lossless
                    quality and transparency. Upload one or multiple AVIF files and download PNG
                    images instantly — fully browser-based, private, and with no signup or limits.
                </p>
            </div>

            <div className="imgtoimgcontainer">
                <div className="tool-container">
                     <h2>AVIF To PNG Converter</h2>
                    <input type="file" multiple accept=".avif" onChange={handleDropzoneFile} />

                    <DropzoneInput
                        accept="image/avif"
                        multiple
                        onFileAccepted={handleDropzoneFile}
                    />

                    <div className="external-inputs">
                        <DriveFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            allowedTypes={[".avif"]}
                        />
                        <DropboxFileInput
                            onFilePicked={handleExternalFilePick}
                            setStatus={setStatus}
                            extensions={[".avif"]}
                        />
                    </div>

                    {previewUrl && (
                        <img src={previewUrl} alt="AVIF preview" className="image-preview-box" />
                    )}

                    <button
                        onClick={convertImages}
                        disabled={processing}
                        className="primary-btn"
                    >
                        {processing ? "Converting..." : "Convert AVIF to PNG"}
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
                    Convert AVIF to PNG Online – Lossless Quality & Maximum Compatibility
                </h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s AVIF to PNG converter is a reliable and easy-to-use online tool
                    that allows you to convert AVIF images into high-quality PNG format instantly.
                    While AVIF offers excellent compression, it is not supported everywhere. This
                    tool helps you convert AVIF images into PNG for maximum compatibility across
                    devices, software, and platforms.
                </p>

                <div className="resizeimg-img">
                    <img src="avif.png" alt="AVIF Image" className="ConverterImgtwo" />
                    <p style={{ textAlign: "center" }}>AVIF Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    AVIF is a modern image format optimized for web performance, but many image
                    editors, operating systems, and older applications do not fully support it.
                    PNG, on the other hand, is universally supported and ideal for editing, printing,
                    archiving, and sharing. Converting AVIF to PNG ensures your images can be used
                    anywhere without compatibility issues.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert AVIF to PNG?</h3>

                <p className="pngtojpg-paragraph">
                    Many users convert AVIF to PNG when they need to edit images in design software,
                    upload files to platforms that don’t support AVIF, or maintain lossless image
                    quality. PNG is widely accepted across browsers, operating systems, and image
                    editing tools.
                </p>

                <p className="pngtojpg-paragraph">
                    PNG also supports transparency, making it ideal for logos, UI assets, icons, and
                    layered graphics. If your AVIF image contains transparent areas, converting it to
                    PNG preserves those areas accurately.
                </p>

                <h3 className="pngtojpg-subheading">Convert Multiple AVIF Images at Once</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers supports batch conversion, allowing you to convert multiple AVIF
                    images to PNG in one go. This saves time and effort, especially when working with
                    large collections of images.
                </p>

                <h3 className="pngtojpg-subheading">
                    Secure, Private, and Browser-Based Conversion
                </h3>

                <p className="pngtojpg-paragraph">
                    Your privacy is fully protected. AVIF to PNG conversion happens entirely in your
                    browser without uploading images to any server. This makes FileUnivers suitable
                    for personal, business, and confidential image conversions.
                </p>

                <h3 className="pngtojpg-subheading">
                    Lossless PNG Output for Editing & Archiving
                </h3>

                <p className="pngtojpg-paragraph">
                    PNG is a lossless format, meaning no additional quality loss occurs during
                    conversion. While AVIF compression artifacts cannot be reversed, the resulting
                    PNG image maintains the highest possible quality based on the original file.
                </p>

                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Is AVIF to PNG conversion free?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the AVIF to PNG converter is 100% free with no restrictions.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Will PNG keep transparency from AVIF?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. Transparent areas in AVIF images are preserved accurately in PNG output.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Are AVIF images uploaded to servers?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            No. All image processing is done locally in your browser.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">
                            Can I edit PNG images easily after conversion?
                        </h3>
                        <p className="pngtojpg-faq-answer">
                            Yes. PNG is widely supported by all major image editing software.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}