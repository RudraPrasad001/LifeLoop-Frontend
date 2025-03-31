import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res,setRes] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setRes("Please select a file first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadUrl(res.data.url);
      setRes("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setRes("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Image to Cloudinary</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
        <p>{res}</p>
      {uploadUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ File Uploaded Successfully!</p>
          <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded Image
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
