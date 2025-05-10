import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./stylesheets/Profile.module.css";
import Cookies from "js-cookie";
import Post from "./Post";
import Comment from './Comment';
import { Link } from "react-router-dom";
function Profile(){
    const[isAuth,setAuth] = useState(true);
  const[decoded,setDecoded]=useState({});
  const[currUser,setCurrUser] = useState();
  const [posts,setPosts] = useState();
  const [currPost,setCurrPost] = useState();
  const [comment,setComment] = useState();
  const [sameUser,setSameUser] =useState(false);
  const [currLikes,setLikes]= useState();
  const[comments,setComments]= useState();
  let {id} = useParams();
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
    const result = await axios.get(`${import.meta.env.VITE_SERVER}/upload/posts`);
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
  const getUser = async(id)=>{
    try{
      const user = await axios.get(`${import.meta.env.VITE_SERVER}/app/user/${id}`);
      setCurrUser(user.data);
      console.log("CURENT USER  "+JSON.stringify(user.data));
      
    }
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
    setPost();
    if(decoded.payload.name===id){
      setSameUser(true);
      getUser(id);
      console.log(decoded.payload);
    }
    else{
      
      setSameUser(false);
      getUser(id);
    }
    console.log("TRUING");
  }    
  },[]
  );
  useEffect(() => {
    if (currUser) {
      console.log("Updated user:", currUser[0]);
  
      // Safe check
      if (Array.isArray(currUser[0].followers)) {
        console.log("Followers count:", currUser[0].followers.length);
      } else {
        console.log("Followers is undefined or not an array.");
      }
    }
  }, [currUser]);


  const handleFollowToggle = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/app/follow`, {
        follower: decoded.name,   
        followee: currUser[0].name,  
      });
  
      if (response.data.updatedUser) {
        setCurrUser(response.data.updatedUser);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  
  const handleLike = async (post) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateLikes`, {
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
  
  const removeCurrentUser = ()=>{
    setCurrPost(null);
  }
  const handleCommentPost = async()=>{
    let user = decoded.name;
    let caption = currPost.caption;
    console.log(`${user} commented "${comment}" on post "${caption}"`);
    
    let res;
    if(comment){
     res = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateComments`,{
      comment:comment,
      caption:caption,
      user:user,
    });}

    document.getElementById('comment').value='';
    if(res){
      setComments(res.comments);
    }



    setComment();
    window.location.reload();
  }
    
    const setPost = async()=>{
        console.log("Trying to get profile posts");
        const post = await axios.get(`${import.meta.env.VITE_SERVER}/profile/${id}`);
        setPosts(post.data);
    }
    return(
      
    <div className={styles.profilePage}>
    <div className={styles.profileContainer} >
      
    <Link  to="/"> <button className={styles}>Home</button></Link>
        <div className={styles.idAndHome}>
        <p>{id}</p>
        {!sameUser && currUser && 
        <button className={styles.followButton} onClick={handleFollowToggle}>
    {currUser[0].followers.includes(decoded.name) ? "Unfollow" : "Follow"}
  </button>}
      </div>
        <div className={styles.idAndName}>
          {currUser && <>
            <p>Followers: {Array.isArray(currUser[0]?.followers) ? currUser[0].followers.length : 0}</p>
            <p>Following: {Array.isArray(currUser[0]?.following) ? currUser[0].following.length : 0}</p>
        </>
          }
        </div>
    </div>        
    <div className={styles.posts}>

      {posts && posts.map((post,index)=><Post key={index} post={post} 
        likesSetter={setLikes} 
        setPosts = {setPosts}
        decoded = {decoded} 
        commentSetter = {setComments} 
      currentPostSetter={setCurrPost} />)}
      
      {currPost &&  
      <div className={styles.postInfoDiv}>
        <div className={styles.postInfo}>
            <div className={styles.postHeaders}>
            <p className={styles.postCaptionInfo}>{currPost.caption}</p>
            <button className={styles.closeButton} onClick={removeCurrentUser}>close</button></div>
            <br />
            <img className={styles.postImageInfo} src={currPost.imageUrl}></img>
                        <p className={styles.commentUserId}>by <Link to={`/user/${currPost.userId}`}>{currPost.userId}</Link></p>
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
            {comments && comments.map((comment,index)=><Comment key={index} user = {decoded.name} currPost = {currPost} comment={comment}/>
              )}
            <br />
          </div>
      </div>
      }
    </div>

    </div>
);
}
export default Profile;