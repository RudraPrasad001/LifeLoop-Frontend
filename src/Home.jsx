import React, { useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import styles from './stylesheets/Home.module.css';
import { Link } from 'react-router-dom';
function Home() {
  const[isAuth,setAuth] = useState(true);
  const[decoded,setDecoded]=useState({});
  const [posts,setPosts] = useState();
  const navigate = useNavigate();
  const decodeTokenManually = (token) => {
    try {
      const parts = token.split('.');
  
      if (parts.length !== 3) {
        throw new Error('Invalid Token Format!');
      }
  
      // Decode Header
      const header = JSON.parse(atob(parts[0]));
  
      // Decode Payload
      const payload = JSON.parse(atob(parts[1]));
  
      // Signature
      const signature = parts[2];
      return { header, payload, signature };
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return null;
    }
  };
  
  const getPosts = async()=>{
    try{
    const result = await axios.get("http://localhost:3001/upload/posts");
    if(!result){
      console.log("No posts");
    }
    else{  
      setPosts(result.data);
      console.log(posts);
    }}
    catch(e){
      console.log(e);
    }
  } 
  

  useEffect(() => {
    const token = Cookies.get('token');
    if(!token){
      setAuth(false)
      navigate("/login");
    }else{
    const decoded = decodeTokenManually(token);
    setDecoded(decoded.payload);
    getPosts();
  }

    
  },[]
  );
  const handleLike = async (post) => {
    try {
      const response = await axios.put("http://localhost:3001/upload/updateLikes", {
        user: decoded.name,
        caption: post.caption,
      });
  
      if (response.data.likes) { // Ensure response has updated likes
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.caption === post.caption ? { ...p, likes: response.data.likes } : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  
  if(isAuth){
    return(
    <div className={styles.container}>
      <p>welcome {decoded.name}</p>
      <Link to="/upload"><button>Upload</button></Link>
      <div className={styles.posts}>

      {posts && posts.map((post,index)=><div key={index} className={styles.postContainer}>
        <p className={styles.postCaption}>{post.caption}</p>
        <img className={styles.postImage} src={post.imageUrl}></img>
        <p className={styles.postUser}>by {post.userId}</p>
        <p className={styles.tag}>Tag:{post.tags}</p>
        <button className={styles.like} onClick={()=>handleLike(post)}>Likes:{post.likes.length}</button>
      </div>)}

      </div>
    </div>

    );
  }
  else{
    return(<div><p>You are not authorized</p></div>);
  }
}
export default Home;