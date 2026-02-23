import { useState, useEffect } from "react";
import JSZip from "jszip";
// import "./ImageResizer.css";
import "./imgtoimg.css"

import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";

import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

export default function PngToJpgPage() {
    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState("jpg"); // jpg | jpeg
    const [quality, setQuality] = useState(0.9);
    const [bg, setBg] = useState("#ffffff");
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [convertedFile, setConvertedFile] = useState(null);
    const [status, setStatus] = useState("");

    /* ================= file handlers ================= */

    const handleDropzoneFile = (input) => {
        // Case 1: input[type=file]
        if (input?.target?.files) {
            const selectedFiles = Array.from(input.target.files);

            const pngFiles = selectedFiles.filter(
                (file) => file.type === "image/png"
            );

            if (!pngFiles.length) return;

            setFiles((prev) => [...prev, ...pngFiles]);
            setPreviewUrl(URL.createObjectURL(pngFiles[0]));
            return;
        }

        // Case 2: DropzoneInput (single File)
        if (input instanceof File) {
            if (input.type !== "image/png") return;

            setFiles((prev) => [...prev, input]);
            setPreviewUrl(URL.createObjectURL(input));
        }
    };

    const handleExternalFilePick = async (picked) => {
        const pickedFiles = Array.isArray(picked) ? picked : [picked];
        const normalized = [];

        for (const item of pickedFiles) {
            if (item instanceof File) {
                if (/\.png$/i.test(item.name)) normalized.push(item);
                continue;
            }

            if (item?.url || item?.downloadUrl) {
                const res = await fetch(item.url || item.downloadUrl);
                const blob = await res.blob();

                if (!blob.type.includes("png")) continue;

                normalized.push(
                    new File([blob], item.name || "image.png", { type: "image/png" })
                );
            }
        }

        if (!normalized.length) return;

        setFiles((prev) => [...prev, ...normalized]);
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

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            return new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        const name = file.name.replace(/\.[^/.]+$/, "");
                        const ext = format;

                        if (zip) {
                            zip.file(`${name}.${ext}`, blob);
                        } else {
                            const outFile = new File([blob], `${name}.${ext}`, {
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

        if (files.length === 1) {
            await processOne(files[0]);
            setProcessing(false);
            return;
        }

        const zip = new JSZip();
        for (const file of files) await processOne(file, zip);

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const zipFile = new File([zipBlob], "png-to-jpg.zip", {
            type: "application/zip",
        });

        setConvertedFile(zipFile);

        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipFile.name;
        a.click();

        setProcessing(false);
    };

    useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

    /* ================= UI ================= */

    return (
        <>
            <Helmet>
                <title>PNG To JPG  | Convert Multiple PNG To JPEG Free Online</title>
                <meta   name="description"
               content="Convert PNG images to JPG or JPEG online for free. Easily change PNG to JPEG with high quality, transparent background support, batch conversion, and instant download. No signup required." />
                <link  rel="canonical"  href="https://fileunivers.com/pngtojpg"/>
                <meta name="robots" content="index, follow" />
                <meta    name="keywords"
                    content="png to jpg, png to jpeg, convert png to jpg online, png to jpeg converter, png to jpg free, png image converter, transparent png to jpg, batch png to jpg"
                />
            </Helmet>

            <ScrollToTop />

            <div className="pagetitle">
                <h1>PNG to JPG Converter – Convert Multiple PNG Images To JPEG Free</h1>
                <p className="intro-paragraph">
                    Convert PNG images to JPG or JPEG online instantly with FileUnivers’s free PNG to JPG converter.
                    This tool allows you to convert transparent PNG files into quality JPG or JPEG images
                    without losing image clarity. Easily upload single or multiple PNG images, choose background
                    color, adjust output quality, and download converted files instantly — no signup, no installation,
                    and no limits.
                </p>
            </div>
            <div className="imgtoimgcontainer">

                <div className="tool-container">
                    <h2>PNG to JPG / JPEG Converter</h2>

                    <input type="file" multiple accept=".png" onChange={handleDropzoneFile} />

                    <DropzoneInput
                        accept="image/png"
                        multiple
                        onFileAccepted={handleDropzoneFile}
                    />

                    <div className="external-inputs">
                        <DriveFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} allowedTypes ={[".png"]} />
                        <DropboxFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} extensions ={[".png"]} />
                    </div>

                    {previewUrl && (
                        <div className="pngtojpgimg">

                            <img src={previewUrl} alt="preview" className="image-preview-box" />
                        </div>
                    )}

                    <div className="controls">
                        <label>
                            Output Format
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                <option value="jpg">JPG</option>
                                <option value="jpeg">JPEG</option>
                            </select>
                        </label>

                        <label>
                            Background Color
                            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
                        </label>

                        <label>
                            Quality ({Math.round(quality * 100)}%)
                            <input
                                type="range"
                                min="0.7"
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
                        {processing ? "Converting..." : "Convert PNG to JPG"}
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

                <h2 className="pngtojpg-heading">Convert PNG to JPG Online – Fast, Free & High Quality</h2>

                <p className="pngtojpg-paragraph">
                    FileUnivers’s PNG to JPG converter is a powerful online tool that helps you convert PNG images
                    to JPG or JPEG format instantly. Whether you are working with transparent PNG images or large
                    image collections, this tool allows you to convert files directly in your browser without
                    uploading them to any server. The entire conversion process happens locally on your device,
                    ensuring maximum privacy, speed, and security.
                </p>

                <div className="resizeimg-img" >
                    <img src="png.png" alt="img Img" className='ConverterImgtwo' />
                    <p style={{ textAlign: "center" }}>PNG Image</p>
                </div>

                <p className="pngtojpg-paragraph">
                    PNG images are widely used because they support transparency and lossless quality, but they
                    often result in large file sizes. JPG and JPEG formats, on the other hand, are more suitable
                    for websites, email attachments, social media, and storage optimization. By converting PNG to
                    JPG, you can significantly reduce image size while maintaining excellent visual quality.
                    FileUnivers makes this conversion simple, fast, and completely free.
                </p>

                <h3 className="pngtojpg-subheading">Why Convert PNG to JPG?</h3>

                <p className="pngtojpg-paragraph">
                    There are many practical reasons to convert PNG images to JPG format. PNG files are ideal for
                    logos and graphics with transparent backgrounds, but they are not always the best choice for
                    photographs or web usage. JPG images load faster on websites, take up less storage space, and
                    are supported universally across all platforms and devices. If you are uploading images to a
                    website, blog, or online marketplace, converting PNG to JPG can improve page speed and user
                    experience.
                </p>

                <p className="pngtojpg-paragraph">
                    Our PNG to JPEG converter also allows you to choose a background color for transparent PNG
                    images. This ensures that transparent areas are filled properly when converting to JPG, which
                    does not support transparency. You can select a white background or any custom color depending
                    on your needs.
                </p>

                <h3 className="pngtojpg-subheading">Convert Multiple PNG Files at Once</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers supports batch conversion, allowing you to convert multiple PNG images to JPG or
                    JPEG in a single process. This feature is especially useful for designers, photographers, and
                    content creators who work with large image collections. Instead of converting images one by
                    one, you can upload multiple PNG files and download all converted JPG images together in a ZIP
                    file.
                </p>

                <p className="pngtojpg-paragraph">
                    Since the tool runs entirely in your browser using modern web technologies like Canvas and
                    JavaScript, there is no fixed limit on the number of files you can upload. However, the actual
                    limit depends on your device’s memory and performance. To ensure a smooth experience, we
                    recommend staying within the suggested file size limits listed below.
                </p>

                <h3 className="pngtojpg-subheading">Recommended File Size Limits by Device</h3>

                <div className="pngtojpg-table-wrapper">
                    <table className="pngtojpg-table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Total PNG Size (together)</th>
                                <th>Approx. Files</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mobile</td>
                                <td>50–100 MB</td>
                                <td>5–15 images</td>
                            </tr>
                            <tr>
                                <td>Laptop (8 GB RAM)</td>
                                <td>200–300 MB</td>
                                <td>20–40 images</td>
                            </tr>
                            <tr>
                                <td>Desktop (16 GB RAM)</td>
                                <td>400–600 MB</td>
                                <td>50–80 images</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="pngtojpg-paragraph">
                    These recommendations help prevent browser slowdowns or memory issues during conversion.
                    Larger images require more memory because each PNG file is decoded, processed on a canvas, and
                    then re-encoded as a JPG image. If you exceed the recommended limits, your browser may become
                    slow or unresponsive.
                </p>

                <h3 className="pngtojpg-subheading">Safe, Private, and Browser-Based Conversion</h3>

                <p className="pngtojpg-paragraph">
                    One of the biggest advantages of using FileUnivers’s PNG to JPG converter is privacy. Your
                    images are never uploaded to any server. All conversions happen locally in your browser, which
                    means your files remain on your device at all times. This makes the tool ideal for converting
                    sensitive or personal images without worrying about data leaks or storage.
                </p>

                <p className="pngtojpg-paragraph">
                    Because the tool is browser-based, there is no need to install any software or create an
                    account. You can use the PNG to JPEG converter on Windows, macOS, Linux, Android, and iOS
                    devices. As long as you have a modern web browser, you can convert images instantly.
                </p>

                <h3 className="pngtojpg-subheading">High Quality Output with Custom Settings</h3>

                <p className="pngtojpg-paragraph">
                    FileUnivers gives you full control over output quality. You can adjust the JPG quality level
                    to balance file size and image clarity. This is especially useful when optimizing images for
                    websites or online platforms where smaller file sizes improve loading speed without noticeable
                    quality loss.
                </p>

                <p className="pngtojpg-paragraph">
                    Whether you need a single PNG converted to JPG or dozens of images processed in bulk,
                    FileUnivers provides a reliable and efficient solution. With no limits, no watermarks, and no
                    registration required, it is the perfect tool for everyday image conversion needs.
                </p>


                <section className="pngtojpg-faq">

                    <h2 className="pngtojpg-faq-heading">Frequently Asked Questions (FAQ)</h2>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Is this PNG to JPG converter free to use?</h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, FileUnivers’s PNG to JPG converter is completely free. You can convert unlimited PNG
                            images to JPG or JPEG without any cost, watermarks, or registration. There are no hidden fees
                            or usage restrictions.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Are my images uploaded to a server?</h3>
                        <p className="pngtojpg-faq-answer">
                            No. All PNG to JPG conversions happen directly in your browser. Your images are never uploaded
                            to any server, which ensures full privacy and security. Once the page is closed, your files
                            are automatically removed from memory.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">How many PNG files can I convert at once?</h3>
                        <p className="pngtojpg-faq-answer">
                            You can convert multiple PNG files at the same time using batch conversion. The actual limit
                            depends on your device’s RAM and performance. For best results, we recommend staying within
                            50–100 MB on mobile, 200–300 MB on laptops, and 400–600 MB on desktops.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Will image quality be reduced after conversion?</h3>
                        <p className="pngtojpg-faq-answer">
                            JPG is a compressed format, but FileUnivers allows you to control output quality. By selecting
                            a high-quality setting, you can convert PNG to JPG with minimal or no visible quality loss,
                            making it perfect for web use and sharing.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">What happens to transparent PNG backgrounds?</h3>
                        <p className="pngtojpg-faq-answer">
                            JPG does not support transparency. During conversion, transparent areas of PNG images are
                            automatically filled with a background color, usually white. Some tools also allow you to
                            choose a custom background color before converting.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Can I use this tool on mobile devices?</h3>
                        <p className="pngtojpg-faq-answer">
                            Yes, the PNG to JPG converter works on mobile phones, tablets, laptops, and desktops. It is
                            compatible with Android, iOS, Windows, macOS, and Linux, as long as you use a modern web
                            browser.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Do I need to install any software?</h3>
                        <p className="pngtojpg-faq-answer">
                            No installation is required. The converter runs entirely online in your browser. Simply open
                            the tool, upload your PNG images, convert them to JPG, and download the results instantly.
                        </p>
                    </div>

                    <div className="pngtojpg-faq-item">
                        <h3 className="pngtojpg-faq-question">Why should I convert PNG to JPG?</h3>
                        <p className="pngtojpg-faq-answer">
                            JPG files are smaller in size and load faster than PNG files. Converting PNG to JPG is ideal
                            for websites, emails, social media, and storage optimization while maintaining good image
                            quality.
                        </p>
                    </div>

                </section>

            </section>
        </>
    );
}