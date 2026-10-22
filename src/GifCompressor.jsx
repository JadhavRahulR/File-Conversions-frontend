import { useEffect, useRef, useState } from "react";
import "./GifCompressor.css";
import { Helmet } from "react-helmet-async";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function GifCompressor() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  
  const [quality, setQuality] = useState(30);
  const [allowColorReduction, setAllowColorReduction] = useState(false);
  const [maxColors, setMaxColors] = useState("256");
  const [resizePercent, setResizePercent] = useState("100");
  const [customLossy, setCustomLossy] = useState("140");

  const [progress, setProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  function clearCompressedResult() {
    setCompressedFile(null);
    setCompressedUrl("");
    setProgress(0);
    setMessage("");
  }

  function handleFile(selectedFile) {
    if (!selectedFile) return;
    setError("");
    clearCompressedResult();

    if (
      selectedFile.type !== "image/gif" &&
      !selectedFile.name.toLowerCase().endsWith(".gif")
    ) {
      setError("Please select a GIF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Maximum GIF file size is 50 MB.");
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
  }

  function handleInputChange(event) {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    if (!isCompressing) handleFile(event.dataTransfer.files?.[0]);
  }

  async function compressGif() {
    if (!file || isCompressing) return;

    setIsCompressing(true);
    setError("");
    setMessage("");
    clearCompressedResult();
    setProgress(5);

    // Smooth Progress Simulator (0% se 95% tak dheere-dheere badhega)
    let currentProgress = 5;
    const progressInterval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress < 95) {
        setProgress(currentProgress);
      }
    }, 100); // Har 100ms me 2% badhega

    try {
      setMessage("Loading compression engine...");
      const module = await import("gifsicle-wasm-browser");
      const gifsicle = module.default;

      if (typeof gifsicle?.run !== "function") {
        throw new Error("GIF compression engine could not be loaded.");
      }

      setMessage("Compressing GIF with your custom settings...");

      const lossyVal = Math.max(0, Math.min(200, Number(customLossy) || Math.round(quality * (200 / 100))));
      
      let colorsArg = "";
      if (allowColorReduction && maxColors !== "256") {
        colorsArg = ` --colors ${maxColors}`;
      }

      let resizeArg = "";
      const scaleNum = Number(resizePercent);
      if (!isNaN(scaleNum) && scaleNum > 0 && scaleNum < 100) {
        resizeArg = ` --resize-fit ${scaleNum}%_${scaleNum}%`;
      }

      const command = `-O3 --optimize=3 --careful${colorsArg}${resizeArg} --lossy=${lossyVal} input.gif -o /out/compressed.gif`;

      const outputFiles = await gifsicle.run({
        input: [{ file, name: "input.gif" }],
        command: [command],
      });

      // Interval ko clear kar dein taaki progress ruk jaye
      clearInterval(progressInterval);
      setProgress(95);

      const output = outputFiles?.find(
        (item) => item instanceof Blob && item.size > 0
      );

      if (!output) {
        throw new Error("The compressor did not produce a valid GIF. Try another file.");
      }

      const resultFile = new File(
        [output],
        `${file.name.replace(/\.gif$/i, "")}-compressed.gif`,
        { type: "image/gif", lastModified: Date.now() }
      );

      setCompressedFile(resultFile);
      setCompressedUrl(URL.createObjectURL(resultFile));
      setProgress(100); // Complete hone par 100%

      const difference = file.size - resultFile.size;
      if (difference > 0) {
        const percent = ((difference / file.size) * 100).toFixed(1);
        setMessage(`Reduced by ${percent}%.`);
      } else {
        setMessage(
          "This GIF is already highly optimized, or the selected settings did not reduce its size."
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error("GIF compression error:", err);
      setError(
        err?.message || "Unable to compress this GIF. Please try another file."
      );
      setProgress(0);
    } finally {
      setIsCompressing(false);
    }
  }
  function downloadGif() {
    if (!compressedUrl || !compressedFile) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = compressedFile.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const savedBytes = compressedFile && file ? file.size - compressedFile.size : 0;
  const savedPercent =
    compressedFile && file
      ? (((file.size - compressedFile.size) / file.size) * 100).toFixed(1)
      : "0.0";

  return (
    <>
    <Helmet>
  <title>GIF Compressor | Reduce GIF File online Free</title>

  <meta
    name="description"
    content="Compress GIF online for free and reduce animated GIF file size while maintaining visual quality. Optimize GIFs quickly without changing dimensions unnecessarily."
  />

  <link
    rel="canonical"
    href="https://fileunivers.com/gif-compressor"
  />

  <meta name="robots" content="index, follow" />

  <meta
    name="keywords"
    content="gif compressor, compress gif online, reduce gif file size, gif optimizer, compress animated gif, free gif compressor, optimize gif online"
  />

  <meta charSet="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
</Helmet>
    <main className="gif-compressor">
      <header className="gif-compressor-header">
        <h1>GIF Compressor Online</h1>
        <p>
          Compress animated GIF files directly in your browser with custom advanced controls.
        </p>
      </header>

      <section className="gif-upload-section">
        <input
          ref={inputRef}
          type="file"
          accept=".gif,image/gif"
          onChange={handleInputChange}
          hidden
          />
        <div
          className="gif-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          >
          <div className="gif-upload-icon" aria-hidden="true">GIF Compressor</div>
          <h2>{file ? file.name : "Upload your GIF"}</h2>
          <p>Drag and drop a GIF file here</p>
          <p className="gif-size-note">Maximum file size: 50 MB</p>
          <button
            type="button"
            className="gif-secondary-button"
            onClick={() => inputRef.current?.click()}
            disabled={isCompressing}
            >
            {file ? "Choose another GIF" : "Choose GIF"}
          </button>
        </div>
      </section>

      {error && <p className="gif-error" role="alert">{error}</p>}

      {file && (
        <section className="gif-settings">
          <div className="gif-preview-grid">
            <div className="gif-preview-card">
              <h3>Original GIF</h3>
              <div className="gif-preview-image">
                <img src={originalUrl} alt="Original GIF preview" />
              </div>
              <p>Size: {formatSize(file.size)}</p>
            </div>

            {compressedFile && (
              <div className="gif-preview-card">
                <h3>Compressed GIF</h3>
                <div className="gif-preview-image">
                  <img src={compressedUrl} alt="Compressed GIF preview" />
                </div>
                <p>Size: {formatSize(compressedFile.size)}</p>
              </div>
            )}
          </div>

          <div className="gif-advanced-settings">
            <h3>Advanced Compression Settings</h3>

            <div className="gif-control-group">
              <div className="gif-quality-heading">
                <label htmlFor="gif-quality">
                  Compression Level: {quality}% {quality >= 80 ? "(Maximum Compression)" : quality >= 40 ? "(Balanced)" : "(Light Compression)"}
                </label>
              </div>
              <input
                id="gif-quality"
                type="range"
                min="0"
                max="100"
                step="1"
                value={quality}
                onChange={(event) => {
                  const val = Number(event.target.value);
                  setQuality(val);
                  setCustomLossy(String(Math.round(val * (200 / 100))));
                  clearCompressedResult();
                  setError("");
                }}
                disabled={isCompressing}
                />
              <div className="gif-range-labels">
                <span>0% (Min compression / Best quality)</span>
                <span>100% (Max compression / Smallest size)</span>
              </div>
            </div>

            <div className="gif-inline-control">
              <label htmlFor="resize-scale">Image Size / Dimensions (%):</label>
              <input
                id="resize-scale"
                type="number"
                min="10"
                max="100"
                value={resizePercent}
                onChange={(e) => {
                  setResizePercent(e.target.value);
                  clearCompressedResult();
                }}
                disabled={isCompressing}
                />
            </div>
            <p className="gif-help-text">
              Keep it at 100% to keep your GIF&apos;s original dimensions unchanged. Lower it only if you want a smaller image size.
            </p>

            <div className="gif-checkbox-group">
              <input
                type="checkbox"
                id="allow-colors"
                checked={allowColorReduction}
                onChange={(e) => {
                  setAllowColorReduction(e.target.checked);
                  clearCompressedResult();
                }}
                disabled={isCompressing}
                />
              <label htmlFor="allow-colors">
                Allow Color Reduction (May alter color gradients)
              </label>
            </div>

            {allowColorReduction && (
              <div className="gif-inline-control gif-color-select-row">
                <label htmlFor="max-colors">Max Colors Limit:</label>
                <select
                  id="max-colors"
                  value={maxColors}
                  onChange={(e) => {
                    setMaxColors(e.target.value);
                    clearCompressedResult();
                  }}
                  disabled={isCompressing}
                  >
                  <option value="256">256 (Original)</option>
                  <option value="192">192 Colors</option>
                  <option value="128">128 Colors</option>
                  <option value="64">64 Colors</option>
                  <option value="32">32 Colors</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            className="gif-primary-button gif-settings-submit"
            onClick={compressGif}
            disabled={isCompressing}
            >
            {isCompressing ? "Compressing GIF..." : "Compress GIF"}
          </button>

          {/* CIRCULAR PROGRESS LOADER */}
          {/* CIRCULAR PROGRESS LOADER */}
          {isCompressing && (
            <div className="gif-circular-progress-container">
              <div 
                className="gif-circular-progress" 
                style={{ background: `conic-gradient(#1021da ${progress * 3.6}deg, #e2e2e2 0deg)` }}
                >
                <div className="gif-circular-inner">
                  <span>{progress}%</span>
                </div>
              </div>
              <p className="gif-progress-msg">{message}</p>
            </div>
          )}

          {message && !isCompressing && <p className="gif-success" aria-live="polite">{message}</p>}

          {compressedFile && (
            <div className="gif-result">
              {savedBytes > 0 ? (
                <p>
                  Saved {formatSize(savedBytes)} ({savedPercent}%)
                </p>
              ) : (
                <p>The output file is not smaller than the original.</p>
              )}
              <button
                type="button"
                className="gif-primary-button gif-download-btn"
                onClick={downloadGif}
                >
                Download Compressed GIF
              </button>
            </div>
          )}
        </section>
      )}
    </main>

    <section className="gif-content">
      <h2>Compress GIF Online for Free</h2>
      <p>
        Looking for an easy way to reduce the size of an animated GIF?
        Our GIF Compressor helps you make GIF files smaller for websites,
        social media, messaging apps, and everyday sharing. Large GIF files
        can take longer to upload, consume more storage, and make web pages
        heavier. Compressing your GIF can help reduce its file size while
        preserving its original appearance as much as possible.
      </p>

      <p>
        Upload your GIF, choose your preferred compression level, and
        download the compressed file. You can compare the original and
        compressed versions to find a suitable balance between file size
        and visual quality. The goal is to make your GIF easier to share
        without unnecessarily changing its dimensions or animation.
      </p>

      <h2>How to Compress a GIF File</h2>
      <p>
        Compressing an animated GIF is simple. Follow these steps to reduce
        its file size using our online tool.
      </p>
      <ol>
        <li>
          <strong>Upload your GIF:</strong> Select a GIF file from your
          device that you want to compress.
        </li>
        <li>
          <strong>Choose compression settings:</strong> Select the
          available compression level according to your file size and
          quality requirements.
        </li>
        <li>
          <strong>Compress the GIF:</strong> Start the compression process
          and allow the tool to optimize the animation.
        </li>
        <li>
          <strong>Preview the result:</strong> Check the compressed GIF
          and compare its appearance and file size with the original.
        </li>
        <li>
          <strong>Download your file:</strong> Save the compressed GIF
          to your device when you are satisfied with the result.
        </li>
      </ol>

      <h2>Why Should You Compress Animated GIFs?</h2>
      <p>
        Animated GIFs can become large because they contain multiple
        frames displayed in sequence. Each frame contributes to the overall
        file size, especially when the animation contains detailed images,
        many colors, or a long duration. A large GIF can be inconvenient
        when uploading files, sharing animations, or adding them to a
        website.
      </p>
      <p>
        Reducing GIF file size can make files easier to upload, download,
        store, and share. Smaller animations can also help reduce page
        weight when used on websites. However, the actual improvement in
        loading speed depends on the page, network connection, caching,
        and other resources.
      </p>

      <h2>Compress GIF Without Changing Dimensions</h2>
      <p>
        Image dimensions are important when you need to preserve the
        original layout of an animation. For example, a GIF measuring
        300 × 400 pixels may need to retain those exact dimensions for
        a website, presentation, or social media post.
      </p>
      <p>
        Reducing width or height can decrease file size, but it also
        changes the displayed dimensions. Compression techniques that
        optimize color palettes, remove redundant frame information, or
        improve frame encoding may reduce file size without resizing
        the animation. The amount of compression depends on the GIF's
        contents and the optimization method used.
      </p>
      <p>
        If maintaining the original dimensions is important, keep the
        width and height unchanged and use the available compression
        settings instead. Always preview the output to confirm that
        the animation still meets your requirements.
      </p>

      <h2>How Does GIF Compression Affect Quality?</h2>
      <p>
        GIF compression works differently from compression methods used
        for formats such as JPEG. GIF images support a palette of up to
        256 colors per frame, so optimizing colors and frame data can
        help reduce file size. More aggressive optimization may produce
        visible color changes, banding, dithering, or differences in
        fine details.
      </p>
      <p>
        A higher compression level may produce a smaller file, but the
        result depends on the original animation and the techniques
        available in the compressor. Simple animations with flat colors
        often compress more efficiently than detailed animations with
        gradients, textures, and frequent changes between frames.
      </p>
      <p>
        For the best balance, compare the compressed preview with the
        original GIF. Choose a setting that reduces file size while
        keeping the animation clear and visually acceptable.
      </p>

      <h2>What Affects the Size of a GIF?</h2>
      <p>
        Several factors influence the size of an animated GIF, including
        its width and height, number of frames, animation duration,
        color palette, and the amount of visual change between frames.
        Larger dimensions generally require more image data, while
        animations with many unique frames may contain more information
        to store.
      </p>
      <p>
        Because every GIF is different, there is no single compression
        percentage that works for every file. Some animations can become
        substantially smaller, while others may show only a modest
        reduction without noticeable quality loss.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>Is this GIF Compressor free to use?</h3>
      <p>
        You can use the available GIF compression tool without purchasing
        desktop software. Check the tool interface for any current file
        size limits or usage restrictions.
      </p>

      <h3>Can I compress a GIF without losing quality?</h3>
      <p>
        Some optimization methods can reduce file size with little visible
        change. However, aggressive color reduction or other lossy
        optimization may affect image quality. Results depend on the
        original GIF and the selected settings.
      </p>

      <h3>Will compression change the GIF dimensions?</h3>
      <p>
        Compression does not always require resizing. If your tool's
        compression process preserves the original width and height,
        the dimensions can remain unchanged while the file size is reduced.
        Check the output dimensions after compression.
      </p>

      <h3>Can I use compressed GIFs on websites?</h3>
      <p>
        Yes. Compressed GIFs can be used in website content, blog posts,
        product demonstrations, and other supported locations. A smaller
        file may be easier to deliver, although modern formats such as
        WebP or animated AVIF may offer better compression for some uses.
      </p>
    </section>
      </>
  );
}