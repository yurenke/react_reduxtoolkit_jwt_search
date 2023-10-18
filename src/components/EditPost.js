import React,{ useState, useEffect } from 'react';
import { Navigate, useNavigate ,useParams } from 'react-router-dom';

import { useSelector } from "react-redux";
import UserService from 'services/user.service';
import EventBus from "common/EventBus";
 
const EditPost = () => {
    const {id}=useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const clickToBackHandler=()=>{
        navigate('/posts');
    }
 
    const [postField, setPostField] = useState({
        title: "",
        content: ""
    });
 
    useEffect(()=>{
        fetchPost();
    },[id])
 
    const fetchPost=async()=>{
        try{
            const result = await UserService.viewPost(id);
            // console.log(result.data);
            setPostField({title: result.data.title, content: result.data.content})
        }catch(err){
            console.log("Something Wrong");
            if (err.response && err.response.status === 401) {
                EventBus.dispatch("logout");
            }
        }
    }
 
    const changePostFieldHandler = (e) => {
        setPostField({
            ...postField,
            [e.target.name]: e.target.value
        });
    }
     
    const onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            await UserService.editPost(id, postField);
            navigate('/posts');  
        } catch (err) {
            console.log("Something Wrong");
            if (err.response && err.response.status === 401) {
                EventBus.dispatch("logout");
            }
        }
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
 
    return(
        <div className="container">
            <h1>Edit Post</h1>
            <form>
                <div className="mb-3 mt-3">
                    <label className="form-label"> Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={postField.title} onChange={changePostFieldHandler} required/>
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label"> Content</label>
                    <textarea id="content" cols="50" name="content" value={postField.content} onChange={changePostFieldHandler} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={e=>onSubmitChange(e)}>Update</button>
            </form>
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={ clickToBackHandler}>Back To Posts</button>
            </div>
        </div>
    );
};
 
export default EditPost;