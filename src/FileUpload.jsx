import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";

const FileUpload = () => {

  const [decoded,setDecoded] = useState();

  const decodeTokenManually = (token) => {
    try {
      const parts = token.split('.');
  
      if (parts.length !== 3) {
        throw new Error('Invalid Token Format!');
      }
  
      const header = JSON.parse(atob(parts[0]));
  
      const payload = JSON.parse(atob(parts[1]));
  
      const signature = parts[2];
      return { header, payload, signature };
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return null;
    }
  };

  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res,setRes] = useState();
  const [caption,setCaption] = useState();
  const [tag,setTag] =  useState();
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };
  
  const handleTagChange = (e) => {
    setTag(e.target.value);
  };


  const handleUpload = async () => {
    if (!file) {
      setRes("Please select a file first.");
      return;
    }
    if (!caption) {
      setRes("Please enter the caption.");
      return;
    }
    if (!tag) {
      setRes("Please enter the tag.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId",decoded.name);
    formData.append("caption",caption);
    formData.append("tag",tag);

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
  useEffect(() => {
      const token = Cookies.get('token');
      if(!token){
        navigate('/login');
      }else{
      const decoded = decodeTokenManually(token);
      setDecoded(decoded.payload);
        console.log(decoded);
    }
      
    },[]
    );
    if(decoded){
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Image to Cloudinary</h2>
      <p>Picture:</p>
      <input type="file" onChange={handleFileChange} />
      <p>Caption:</p>
      <input type="text" onChange={handleCaptionChange} />
      <p>Tags</p>
      <select onChange={handleTagChange}>
        <option value="nature">Nature</option>
        <option value="animal">Animal</option>
        <option value="food">Food</option>
        <option value="gaming">Gaming</option>
        <option value="tech">Tech</option>
      </select>
      
      <button
        onClick={handleUpload}
        disabled={loading}
       
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
        <p>{res}</p>
      {uploadUrl && (
        <div>
          <p>✅ File Uploaded Successfully!</p>
          <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded Image
          </a>
        </div>
      )}
    </div>
  );}
  else{
   navigate("/login")
  }
};

export default FileUpload;
