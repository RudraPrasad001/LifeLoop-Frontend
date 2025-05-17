import styles from './stylesheets/Post.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Post(props){

    const post = props.post;
    const setCurrPost = props.currentPostSetter;
    const setLikes = props.likesSetter;
    const setComments = props.commentSetter;
    const setPosts = props.setPosts;
    const decoded = props.decoded;


    const openPost= (post)=>{
        setCurrPost(post);
        console.log(post.comments.length);
        setComments(post.comments);
        setLikes(post.likes.length);
      }

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



    return(
        <div className={styles.postContainer}>
            
                    <p className={styles.postCaptionInfo}>{post.caption}</p>
                    <p className={styles.created}>Posted at {post.createdAt.toString().substring(0,10)}</p>
                    <img className={styles.postImage} src={post.imageUrl} onClick={()=>openPost(post)}></img>
                    <p className={styles.commentUserId}>by <Link to={`/user/${post.userId}`}>{post.userId}</Link></p>
                    <p className={styles.tag}>Tag:{post.tags}</p>
                    <button  onClick={()=>handleLike(post)}>♡ {post.likes.length}</button>
                    <button onClick={()=>openPost(post)} >Comment</button>
        </div>
    )
}
export default Post;