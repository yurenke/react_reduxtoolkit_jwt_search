import React, { useState, useEffect } from 'react';
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
 
    return <div>
        <div className="container">
            <div className='row'>
                <div className='col-md-12'>
 
                    <h1>View Post</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Update Time</th>
                                <th>Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.content}</td>
                                <td>{post.update_time}</td>
                                <td>{post.author}</td>
                            </tr>
 
                        </tbody>
                    </table>
                </div>
 
            </div>
        </div>
        <div className='container d-flex justify-content-center'>
            <div><button className='btn btn-primary' onClick={clickToBackHandler}>Back To Posts</button></div>
        </div>
    </div>;
};
 
export default ViewPost;