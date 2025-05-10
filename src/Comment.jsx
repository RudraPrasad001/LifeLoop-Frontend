import styles from './stylesheets/Home.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
function Comment(props){
  const [currLikes,setLikes]= useState();
  const post = props.currPost;
    const user = props.user;
    const comment = props.comment; 
    const data ={
            post,
            comment,
            user,
        }

    const incLike = async()=>{
        try{
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/inc`,data);
        if(response){
            setLikes(response.data.likes);
        }
        else{
            console.log("false");
        }}
        catch(e)
        {
            console.log(e)
        }
    }
    const getLike = async()=>{
        try{
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/get`,data);
        if(response){
            setLikes(response.data.likes);
        }
        else{
            console.log("false");
        }}
        catch(e)
        {
            console.log(e)
        }
    }
    useEffect(()=>getLike,[]);

    return(<div className={styles.commentBox}>
              <p className={styles.commentUserId}><Link to={`/user/${comment.userId}`}>@{comment.userId}</Link> <i>{comment.createdAt.toString().substring(0,10)}</i></p>
              <p className={styles.commentText}>{comment.text}</p>
              
              <button onClick={incLike}>❤️{currLikes}</button>
              </div>)
}
export default Comment;