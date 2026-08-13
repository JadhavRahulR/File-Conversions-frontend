import React, { useMemo, useState } from "react";
import JSZip from "jszip";
import "./BulkRenamer.css";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";

const BulkRenamer = () => {
    const [files, setFiles] = useState([]);
    const [commonName, setCommonName] = useState("");
    const [digits, setDigits] = useState(3);
    const [startNumber, setStartNumber] = useState(1);
    const [separator, setSeparator] = useState("-");
    const [customNames, setCustomNames] = useState({});

    const handleFiles = (selectedFiles) => {
        const fileArray = Array.from(selectedFiles || []);

        setFiles((prev) => [...prev, ...fileArray]);
    };

    const handleCustomNameChange = (index, value) => {
        setCustomNames((prev) => ({
            ...prev,
            [index]: value,
        }));
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setFiles([]);
    };

    const getExtension = (filename) => {
        const lastDot = filename.lastIndexOf(".");

        if (lastDot === -1) return "";

        return filename.slice(lastDot);
    };

    const getNewName = (file, index) => {
        const number = String(startNumber + index).padStart(
            Number(digits),
            "0"
        );

        const name = commonName.trim();

        if (!name) {
            return number;
        }

        return `${name}${separator}${number}`;
    };

    const previewFiles = useMemo(() => {
        return files.map((file, index) => ({
            original: file.name,
            renamed: getNewName(file, index),
        }));
    }, [files, commonName, digits, startNumber, separator]);

    const renameAndDownload = async () => {
        if (!files.length) {
            alert("Please select files first.");
            return;
        }

        if (!commonName.trim()) {
            alert("Please enter a common name.");
            return;
        }

        const zip = new JSZip();

        files.forEach((file, index) => {
            const automaticName = getNewName(file, index);

            const customName =
                customNames[index] !== undefined
                    ? customNames[index].trim()
                    : "";

            const finalName = customName || automaticName;

            const extension = getExtension(file.name);

            zip.file(`${finalName}${extension}`, file);
        });

        const blob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 6,
            },
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${commonName.trim()}-renamed.zip`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };
    return (
        <>

        <Helmet>
  <title>Bulk Renamer - Rename Multiple Files Online Free</title>

  <meta
    name="description"
    content="Rename multiple files online for free with FileUnivers Bulk Renamer. Bulk rename files, batch rename files, customize filenames, preview changes, and download renamed files easily."
  />

  <meta
    name="keywords"
    content="bulk renamer, bulk file renamer, bulk rename files, rename multiple files, rename multiple files online, batch rename files, batch file renaming, online file renamer, file renaming tool, bulk renaming tool, rename files online, bulk file renaming, rename files in bulk, multiple file renamer, free bulk renamer"
  />

  <link
    rel="canonical"
    href="https://fileunivers.com/bulk-renamer"
  />

  <meta
    name="robots"
    content="index,follow"
  />
</Helmet>  

<ScrollToTop/>

            <div className="bulk-renamer">

                <div className="bulk-renamer-header">
                    <h1>Bulk Renamer – Rename Multiple Files Online</h1>

<p>
  Rename multiple files quickly, easily, and securely with FileUnivers Bulk
  Renamer, a free online bulk file renaming tool. This online file renamer
  lets you rename multiple files at once instead of changing each filename
  individually. Select or drag and drop your files, enter a common name,
  choose your preferred numbering format and separator, and instantly
  preview the new filenames before downloading them.
</p>

<p>
  Whether you need to bulk rename files, batch rename files, rename multiple
  files, or organize a large collection of files, FileUnivers Bulk Renamer
  provides a simple and convenient solution directly in your browser. You
  can use this bulk renaming tool for images, photos, documents, PDFs,
  videos, project files, product images, and many other file types.
</p>
                </div>

                {/* Upload Area */}

                <div
                    className="upload-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                >
                    <div className="upload-icon">📁</div>

                    <h2>
                        {files.length > 0
                            ? `${files.length} ${files.length === 1 ? "File" : "Files"} Selected`
                            : "Drop your files here"}
                    </h2>

                    <p>
                        {files.length > 0
                            ? "You can add more files or continue below."
                            : "or"}
                    </p>

                    <label className="browse-button">
                        {files.length > 0 ? "Add More Files" : "Browse Files"}

                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </label>

                    <span className="upload-note">
                        {files.length > 0
                            ? `${files.length} files ready to rename`
                            : "Your files stay on your device."}
                    </span>
                </div>

                {/* Settings */}

                {files.length > 0 && (
                    <div className="rename-settings">

                        <div className="setting-group">
                            <label>Common Name</label>

                            <input
                                type="text"
                                value={commonName}
                                onChange={(e) => setCommonName(e.target.value)}
                                placeholder="e.g MyFile "
                            />
                        </div>

                        <div className="settings-row">

                            <div className="setting-group">
                                <label>Number of Digits</label>

                                <select
                                    value={digits}
                                    onChange={(e) =>
                                        setDigits(Number(e.target.value))
                                    }
                                >
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                        (value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="setting-group">
                                <label>Starting Number</label>

                                <input
                                    type="number"
                                    min="0"
                                    value={startNumber}
                                    onChange={(e) =>
                                        setStartNumber(Number(e.target.value))
                                    }
                                />
                            </div>

                            <div className="setting-group">
                                <label>Separator</label>

                                <input
                                    type="text"
                                    value={separator}
                                    onChange={(e) => setSeparator(e.target.value)}
                                    maxLength={10}
                                    placeholder="e.g. _ or -"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview */}

                {files.length > 0 && (
                    <div className="preview-section">

                        <div className="preview-header">
                            <h2>Preview</h2>

                            <span>
                                {files.length}{" "}
                                {files.length === 1 ? "file" : "files"}
                            </span>
                        </div>

                        <div className="preview-table">

                            <div className="preview-row preview-heading">
                                <div>Original Name</div>
                                <div>New Name</div>
                                <div></div>
                            </div>

                            {previewFiles.map((item, index) => (
                                <div className="preview-row" key={`${item.original}-${index}`}>

                                    <div className="original-name">
                                        {item.original}
                                    </div>

                                    <div className="new-name">
                                        <input
                                            type="text"
                                            value={customNames[index] ?? item.renamed}
                                            onChange={(e) =>
                                                handleCustomNameChange(index, e.target.value)
                                            }
                                        />
                                    </div>

                                    <button
                                        className="remove-file"
                                        onClick={() => removeFile(index)}
                                        title="Remove file"
                                    >
                                        ×
                                    </button>

                                </div>
                            ))}

                        </div>
                    </div>
                )}

                {/* Actions */}

                {files.length > 0 && (
                    <div className="actions">

                        <button
                            className="clear-button"
                            onClick={clearFiles}
                        >
                            Clear All
                        </button>

                        <button
                            className="bulk-rename-button"
                            onClick={renameAndDownload}
                        >
                            Rename & Download ZIP
                        </button>

                    </div>
                )}

            </div>

            <section className="bulk-renamer-content">
                <h2>Bulk Renamer – Rename Multiple Files Online</h2>

                <p>
                    Managing a large number of files can become time-consuming when every
                    file needs to be renamed individually. FileUnivers Bulk Renamer makes
                    it easy to rename multiple files at once directly from your browser.
                    Whether you have images, documents, PDFs, videos, or other files, this
                    bulk file renamer helps you create consistent and organized filenames
                    in just a few steps.
                </p>

                <h3>Rename Multiple Files at Once</h3>

                <p>
                    Instead of renaming files one by one, use our bulk rename files tool
                    to process multiple files together. Select or drag and drop your files
                    into the tool, enter a common name, choose the number of digits, and
                    set your preferred separator. The tool instantly generates a preview
                    so you can check the new filenames before downloading them.
                </p>

                <p>
                    For example, if you select several images and enter
                    <strong> Project </strong>
                    as the common name with three digits, your files can be renamed as
                    Project 001, Project 002, Project 003, and Project 004. You can also
                    choose a custom separator such as an underscore or hyphen to create
                    filenames like Project_001 or Project-001.
                </p>

                <h3>Customize Your File Names</h3>

                <p>
                    The online bulk renamer gives you control over how your filenames are
                    created. You can choose the starting number and the number of digits
                    required for your files. You can also manually edit individual
                    filenames from the preview section if a particular file needs a
                    different name.
                </p>

                <p>
                    For example, you might automatically generate Product 001, Product 002,
                    and Product 003, but change one specific file to Summer Collection
                    before downloading. This makes the tool useful for organizing product
                    images, project files, documents, photos, and other collections.
                </p>

                <h3>Keep Original File Extensions</h3>

                <p>
                    File extensions are handled automatically. You don't need to type
                    .jpg, .png, .pdf, .docx, or other extensions while renaming your files.
                    The tool keeps the original extension and adds it automatically when
                    the renamed files are prepared for download.
                </p>

                <p>
                    For example, an image.jpg file can become Product 001.jpg, a document.pdf
                    file can become Product 002.pdf, and a photo.png file can become
                    Product 003.png. This helps prevent accidental changes to file formats
                    while performing batch file renaming.
                </p>

                <h3>Preview Before Downloading</h3>

                <p>
                    Before downloading your renamed files, you can review the complete list
                    of original and new filenames. The preview makes it easy to spot
                    mistakes and manually adjust individual names when needed.
                </p>

                <p>
                    Once everything looks correct, click the rename and download button to
                    create a ZIP file containing your renamed files.
                </p>

                <h3>Fast, Simple and Browser-Based</h3>

                <p>
                    FileUnivers Bulk Renamer is designed to make batch file renaming simple
                    and convenient. Your files can be selected directly from your device,
                    and the renaming process is handled in the browser. You don't need to
                    install separate desktop software just to rename multiple files.
                </p>

                <p>
                    Whether you're organizing hundreds of photos, preparing product images,
                    managing documents, or cleaning up a folder of downloaded files,
                    FileUnivers provides a convenient file renaming tool for quickly
                    creating consistent filenames.
                </p>

                <p>
                    Try FileUnivers Bulk Renamer to rename multiple files, organize your
                    filenames, and save time with simple and convenient batch file
                    renaming.
                </p>
            </section>
        </>
    );
};

export default BulkRenamer;