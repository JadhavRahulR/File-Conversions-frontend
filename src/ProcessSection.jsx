import React from "react";


import "./processSection.css";

const ProcessSection = () => {
    return (
        <>
            <section className="process-section">

                <div className="process-heading">
                    <h2>How It Works</h2>
                    <p>
                        Process your files in just a few simple steps. No installation,
                        registration, or technical knowledge required.
                    </p>
                </div>

                <div className="process-grid">

                    <div className="process-card">
                        <div className="process-icon">
                            <div className="process-icon">
                                <img src="/upload.png" alt="Upload" width="42" height="42" />
                            </div>
                        </div>

                        <span className="step-number">01</span>

                        <h3>Upload Your File</h3>

                        <p>
                            Upload files from your computer, Google Drive, or Dropbox using
                            our secure uploader.
                        </p>
                    </div>

                    <div className="process-card">
                        <div className="process-icon">
                            <div className="process-icon">
                                <img src="/exchange.png" alt="Upload" width="42" height="42" />
                            </div>
                        </div>

                        <span className="step-number">02</span>

                        <h3>Process Your File</h3>

                        <p>
                            Our servers process your file securely while preserving the
                            original quality and formatting.
                        </p>
                    </div>

                    <div className="process-card">
                        <div className="process-icon">
                            <div className="process-icon">
                                <img src="/down-arrow.png" alt="Download" width="42" height="42" />
                            </div>
                        </div>

                        <span className="step-number">03</span>

                        <h3>Download Your File</h3>

                        <p>
                            Download the Process file instantly or save it directly to your
                            preferred cloud storage.
                        </p>
                    </div>

                </div>

            </section>
            <section className="choose-section">

                <div className="choose-heading">
                    <h2>Choose Your File Source</h2>

                    <p>
                        Select files from your preferred location. FileUnivers supports local
                        storage and popular cloud services for a seamless upload experience.
                    </p>
                </div>

                <div className="choose-grid">

                    <div className="choose-card">
                        <div className="choose-icon">
                            <div className="process-icon">
                                <img src="/upload.png" alt="Download" width="42" height="42" />
                            </div>
                        </div>

                        <h3>Local Device</h3>

                        <p>
                            Select files directly from your computer, laptop, tablet, or mobile
                            device.
                        </p>
                    </div>

                    <div className="choose-card">
                        <div className="choose-icon google">
                            <div className="process-icon">
                                <img
                                    src="/google-drive.png"
                                    alt="Google Drive"
                                    width="44"
                                    height="44"
                                />

                            </div>
                        </div>

                       <h3> Select From Google-Drive</h3>

                        <p>
                            Import documents, PDFs, images, spreadsheets, and presentations
                            from Google Drive.
                        </p>
                    </div>

                    <div className="choose-card">
                        <div className="choose-icon dropbox">
                            <div className="process-icon">
                                <img src="/dropbox.png" alt="Download" width="42" height="42" />
                            </div>
                        </div>

                        <h3> Select From Dropbox</h3>

                        <p>
                            Access files securely from Dropbox and start converting them in
                            seconds.
                        </p>
                    </div>

                </div>

            </section>

            <section className="choose-section">

                <div className="choose-heading">
                    <h2>Save Your Converted File</h2>

                    <p>
                        Once your file has been converted, download it to your device or
                        save it directly to your preferred cloud storage with just one click.
                    </p>
                </div>

                <div className="choose-grid">

                    {/* Local Device */}

                    <div className="choose-card">
                        <div className="choose-icon">
                            <div className="process-icon">
                                <img
                                    src="/upload.png"
                                    alt="Save to Google Drive"
                                    width="42"
                                    height="42"
                                />
                            </div>
                        </div>

                        <h3>Download to Device</h3>

                        <p>
                            Save your converted file directly to your computer, laptop,
                            tablet, or mobile device instantly.
                        </p>
                    </div>

                    {/* Google Drive */}

                    <div className="choose-card">
                        <div className="choose-icon google">
                            <div className="process-icon">

                                <img
                                    src="/google-drive.png"
                                    alt="Google Drive"
                                    width="44"
                                    height="44"
                                />
                            </div>
                        </div>


                        <h3>Save in Google-Drive</h3>
                        <p>
                            Save your converted files directly to Google Drive and access
                            them anytime from any device.
                        </p>
                    </div>

                    {/* Dropbox */}

                    <div className="choose-card">
                        <div className="choose-icon dropbox">
                            <div className="process-icon">
                                <img
                                    src="/dropbox.png"
                                    alt="Dropbox"
                                    width="44"
                                    height="44"
                                />

                            </div>
                        </div>

                        <h3>Save in Dropbox</h3>
                        <p>
                            Export your converted files directly to Dropbox for secure cloud
                            storage and easy sharing.
                        </p>
                    </div>

                </div>

            </section>

        </>
    );
};

export default ProcessSection;