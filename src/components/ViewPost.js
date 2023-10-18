import React, { useState, useEffect} from 'react';
import { Navigate, useParams,useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";
import UserService from 'services/user.service';
import EventBus from "common/EventBus";
 
const ViewPost = () => {
    const {id}=useParams();
    // console.log(id);
    const[post,setPost]=useState([]);
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
 
    useEffect(()=>{
        fetchPost();
    },[id]);
 
    const fetchPost=async()=>{
        try{
        const result = await UserService.viewPost(id);
        console.log(result.data);
        setPost(result.data)
 
        }catch(err){
            console.log("Something Wrong");
            if (err.response && err.response.status === 401) {
                EventBus.dispatch("logout");
            }
        }
    }
 
    const clickToBackHandler=()=>{
        navigate('/posts');
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
 
    return (
        <div>
            <div class="postheader">
                <div class="container">
                    <h1>{post.title}</h1>
                    <p>
                    <small>By <em>{post.author}</em> | Posted:
                        <em>{" " + post.update_time}</em> | Last Updated:
                        <em>{" " + post.create_time}</em>
                    </small>
                    </p>
                </div>
            </div>
            <main>
                <article class="container">
                    <h3>{post.content}</h3>
                </article>
            </main>
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={ clickToBackHandler}>Back To Posts</button>
            </div>
        </div>
        // <div>
        //     <div>
        //         <h2>{post.title}</h2>
        //     </div>
        //     <div>
        //       <label>
        //         <strong>Author:</strong>
        //       </label>{" "}
        //       {post.author}
        //     </div>
        //     <div>
        //       <label>
        //         <strong>Update Time:</strong>
        //       </label>{" "}
        //       {post.update_time}
        //     </div>
        //     <div>
        //       <label>
        //         <strong>Content:</strong>
        //       </label>{" "}
        //       {post.content}
        //     </div>
    );
};
 
export default ViewPost;