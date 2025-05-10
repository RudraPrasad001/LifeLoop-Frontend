import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import styles from "./stylesheets/FileUpload.module.css";

const FileUpload = () => {
  const [decoded, setDecoded] = useState();
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState();
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  const handleFileChange =(e)=>{
    setFile(e.target.files[0]);
  }

  const decodeTokenManually = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid Token Format!');
      const payload = JSON.parse(atob(parts[1]));
      return { payload };
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!file || !caption || !tag) {
      setRes("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", decoded.name);
    formData.append("caption", caption);
    formData.append("tag", tag);

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadUrl(res.data.url);
      setRes("Posted successfully!");
      setCaption("");
      setTag("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setRes("Failed to post.Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return navigate('/login');
    const decoded = decodeTokenManually(token);
    if (!decoded) return navigate('/login');
    setDecoded(decoded.payload);
  }, [navigate]);

  if (!decoded) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Upload Image</h2>
        <div className={styles.uploadIconWrapper}>
          {file==null &&
          <>
          <label htmlFor="file-upload" className={styles.uploadLabel}>+</label> 
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
          />
          </>
          }
          {file && <>
          <label htmlFor="file-upload" className={styles.uploadLabelPreview}><img src={URL.createObjectURL(file)} alt="preview" className={styles.previewImage} /></label> 
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className={styles.overClickInput}
          /></>}

        </div>

        <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className={styles.input} />
        <select value={tag} onChange={(e) => setTag(e.target.value)} className={styles.input}>
          <option value="">Select Tag</option>
          <option value="nature">Nature</option>
          <option value="animal">Animal</option>
          <option value="food">Food</option>
          <option value="gaming">Gaming</option>
          <option value="tech">Tech</option>
          <option value="people">People</option>
          <option value="entertainment">Entertainment</option>
          <option value="anime">Anime</option>
          <option value="education">Education</option>
          <option value="Movies & TV Shows">Movies and TV Shoes</option>
        </select>
        <button onClick={handleUpload} disabled={loading} className={styles.uploadBtn}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {res && <><p className={styles.message}>{res}</p>
          <Link className={styles.gotoHome} to="/">Home</Link></>
        }
       
      </div>
    </div>
  );
};

export default FileUpload;
