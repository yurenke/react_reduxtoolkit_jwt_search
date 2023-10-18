import React, { useState  } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import UserService from "services/user.service";
import EventBus from "common/EventBus";
 
export default function CreatePost(){
  
    const navigate = useNavigate();

    const clickToBackHandler=()=>{
        navigate('/posts');
    }
  
    const [inputs, setInputs] = useState({
        title: "",
        content: ""
    });
    const { user: currentUser } = useSelector((state) => state.auth);
  
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
  
        UserService.createPost(inputs).then(function(response){
            console.log(response.data);
            navigate('/posts');
        })
        .catch(function(err){
            console.log("Something Wrong");
            if (err.response && err.response.status === 401) {
                EventBus.dispatch("logout");
            }
        });
          
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
     
    return (
        <div className="container">
            <div className="submit-form">
                <div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                        type="text"
                        className="form-control"
                        id="title"
                        required
                        onChange={handleChange}
                        name="title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea name="content" cols="50" onChange={handleChange} />
                        {/* <input
                        type="text"
                        className="form-control"
                        id="description"
                        required
                        value={tutorial.description || ''}
                        onChange={handleChange}
                        name="description"
                        /> */}
                    </div>

                    <button onClick={handleSubmit} className="btn btn-success">
                        Submit
                    </button>

                    {/* <button className='btn btn-primary' onClick={ clickToBackHandler}>Back To Posts</button> */}
                </div>
            </div>
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={ clickToBackHandler}>Back To Posts</button>
            </div>
        </div>
    // <div>
    //     <div className="container h-100">
    //         <div className="row">
    //             <div className="col-2"></div>
    //             <div className="col-8">
    //             <h1>Create Post</h1>
    //             <form onSubmit={handleSubmit}>
    //                 <div className="mb-3">
    //                   <label>Title</label>
    //                   <input type="text" className="form-control" name="title" onChange={handleChange} />
    //                 </div>
    //                 <div className="mb-3">
    //                   <label>Content</label>
    //                   <textarea name="content" onChange={handleChange} />
    //                 </div>   
    //                 <button type="submit" name="add" className="btn btn-primary">Save</button>
    //             </form>
    //             </div>
    //             <div className="col-2"></div>
    //         </div>
    //     </div>
    // </div>
  );
}