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
  const [currPost,setCurrPost] = useState();
  const [comment,setComment] = useState();
  const [currLikes,setLikes]= useState();
  const[comments,setComments]= useState();
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

  const handleCommentChange=(e)=>{
    if(e.target.value.length!=0){
      setComment(e.target.value);
      
    console.log(e.target.value);
    }
  }
  
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
  
      if (response.data.likes) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.caption === post.caption ? { ...p, likes: response.data.likes } : p
          )
        );
        setLikes(response.data.likes.length);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  const openPost= (post)=>{
    setCurrPost(post);
    console.log(post.comments.length);
    setComments(post.comments);
    setLikes(post.likes.length);
  }
  
  const removeCurrentUser = ()=>{
    setCurrPost(null);
  }
  const handleCommentPost = async()=>{
    let user = decoded.name;
    let caption = currPost.caption;
    console.log(`${user} commented "${comment}" on post "${caption}"`);
    document.getElementById('comment').value='';
    
    const res = await axios.put("http://localhost:3001/upload/updateComments",{
      comment:comment,
      caption:caption,
      user:user,
    });

    if(res){
      setComments(res.comments);
    }



    setComment();
    window.location.reload();
  }
  const logout = ()=>{
    Cookies.remove('token');
    window.location.reload();
  }

  if(isAuth){
    return(
    <div className={styles.container}>
      <div className={styles.titleLogout}>
        <div className={styles.title}>  
          <h1>Lifeloop</h1>
        </div>
        <div className={styles.logoutDiv}>
          <button className={styles.like} onClick={logout}>Logout</button>
        </div>
        </div>
      <p>welcome {decoded.name}</p>
      <Link to="/upload"><button>Upload</button></Link>
      <div className={styles.posts}>

      {posts && posts.map((post,index)=><div key={index} className={styles.postContainer} >
        <p className={styles.postCaption}>{post.caption}</p>
        <img className={styles.postImage} src={post.imageUrl} onClick={()=>openPost(post)}></img>
        <p className={styles.postUser}>by {post.userId}</p>
        <p className={styles.tag}>Tag:{post.tags}</p>
        <button className={styles.like} onClick={()=>handleLike(post)}>♡ {post.likes.length}</button>
        <button onClick={()=>openPost(post)} className={styles.like}>Comment</button>
      </div>)}

      </div>
      
      {currPost &&  
      <div className={styles.postInfoDiv}>
        <div className={styles.postInfo}>
            <div className={styles.postHeaders}>
            <p className={styles.postCaptionInfo}>{currPost.caption}</p>
            <button className={styles.closeButton} onClick={removeCurrentUser}>close</button></div>
            <br />
            <img className={styles.postImageInfo} src={currPost.imageUrl}></img>
            <p className={styles.postUserInfo}>by {currPost.userId}</p>
            <p className={styles.tagInfo}>Tag:{currPost.tags}</p>
            <br />
            <button className={styles.like} onClick={()=>handleLike(currPost)}>♡ {currLikes}</button>
         </div> 
         <div className={styles.commentSection}>
          <div className={styles.stickyDiv}>
                <p className={styles.commentHeader}>Comments</p>
            <input type="text" name="comment" id="comment" className={styles.comment} onChange={handleCommentChange} />
            <button onClick={handleCommentPost}>Send</button>
            </div>
            {comments && comments.map((comment,index)=><div key={index} className={styles.commentBox}>
              <p className={styles.commentUserId}>{comment.userId}</p>
              <p className={styles.commentText}>{comment.text}</p>
              </div>
              )}
            <br />
          </div>
      </div>
      }
    </div>

    );
  }
  else{
    return(<div><p>You are not authorized</p></div>);
  }
}
export default Home;