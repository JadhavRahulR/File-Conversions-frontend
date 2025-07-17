// import React, { useState } from 'react';
// import axios from 'axios';

// function FileConverter() {
//   const [file, setFile] = useState(null);
//   const [convertType, setConvertType] = useState('word-to-pdf');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleConvert = async () => {
//     if (!file) return alert("Please choose a file");

//     const formData = new FormData();
//     formData.append("file", file);

//     const url =
//       convertType === "word-to-pdf"
//         ? "http://localhost:5000/convert-word-to-pdf"
//         : "http://localhost:5000/convert-pdf-to-word";

//     try {
//       const res = await axios.post(url, formData, {
//         responseType: 'blob',
//       });

//       const blob = new Blob([res.data]);
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download =
//         convertType === "word-to-pdf" ? "converted.pdf" : "converted.docx";
//       link.click();
//     } catch (error) {
//       console.error("Conversion failed", error);
//       alert("Conversion failed. Check console for details.");
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>📄 PDF ⇄ Word Converter</h2>

//       <select
//         value={convertType}
//         onChange={(e) => setConvertType(e.target.value)}
//         style={{ marginBottom: '1rem' }}
//       >
//         <option value="word-to-pdf">Word to PDF</option>
//         <option value="pdf-to-word">PDF to Word</option>
//       </select>
//       <br />

//       <input type="file" onChange={handleFileChange} />
//       <br /><br />

//       <button onClick={handleConvert}>Convert & Download</button>
//     </div>
//   );
// }

// export default FileConverter;
