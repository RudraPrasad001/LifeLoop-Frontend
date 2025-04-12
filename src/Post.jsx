import styles from './stylesheets/Home.module.css';
import axios from 'axios';
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



    return(
        <div className={styles.postContainer}>
            
                    <p className={styles.postCaption}>{post.caption}</p>
                    <img className={styles.postImage} src={post.imageUrl} onClick={()=>openPost(post)}></img>
                    <p className={styles.postUser}>by {post.userId}</p>
                    <p className={styles.tag}>Tag:{post.tags}</p>
                    <button className={styles.like} onClick={()=>handleLike(post)}>♡ {post.likes.length}</button>
                    <button onClick={()=>openPost(post)} className={styles.like}>Comment</button>
        </div>
    )
}
export default Post;