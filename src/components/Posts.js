import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from 'react-router-dom';
import { Navigate , useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import EventBus from "common/EventBus";
import UserService from "services/user.service";
import Pagination from "@mui/material/Pagination";
import { useTable } from "react-table";
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
  
const ListPosts = (props) => {
    const [posts, setPosts] = useState([]);
    // const [info, setInfo] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const { user: currentUser } = useSelector((state) => state.auth);
    const postsRef = useRef();

    postsRef.current = posts;

    const navigate = useNavigate();
    
    const onChangeSearchTerm = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
    };

    const getRequestParams = (searchTerm, page) => {
        let params = {};
    
        if (searchTerm) {
          params["term"] = searchTerm;
        }
    
        if (page) {
          params["page"] = page;
        //   params["page"] = page - 1;
        }
    
        return params;
    };
  
    const fetchPosts = () => {
        const params = getRequestParams(searchTerm, page);

        UserService.getPosts(params)
            .then((response) => {
                setPosts(response.data.results);
                setCount(response.data.totalPages);
                //console.log(data.data.results);
                // setInfo(data.data);
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            });
    };

    // const handleNextPage = () => {
    //     fetchPosts(info.next_page);
    //     window.scrollTo(0, 0);
    // };

    // const handlePreviousPage = () => {
    //     fetchPosts(info.prev_page);
    //     window.scrollTo(0, 0);
    // };
    // useEffect(fetchPosts(), []);

    const findByTerm = () => {
        setPage(1);
        fetchPosts();
    };

    const viewPost = (rowIndex) => {
        const id = postsRef.current[rowIndex].id;
    
        navigate("/view/" + id);
    };

    const editPost = (rowIndex) => {
        const id = postsRef.current[rowIndex].id;
    
        // props.history.push("/edit/" + id);
        navigate("/edit/" + id);
    };
    
    const handleDelete = (rowIndex) => {
        const id = postsRef.current[rowIndex].id;
    
        UserService.deletePost(id)
          .then((response) => {
            // props.history.push("/posts");
    
            let newPosts = [...postsRef.current];
            newPosts.splice(rowIndex, 1);
    
            setPosts(newPosts);
          })
          .catch((e) => {
            console.log(e);
            if (e.response && e.response.status === 401) {
                EventBus.dispatch("logout");
            }
          });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(fetchPosts, [page]);
   
    // const handleDelete = (id) => {
    //     UserService.deletePost(id)
    //     .then(function(response){
    //         console.log(response.data);
    //         alert("Successfully Deleted");
    //         fetchPosts(1);
    //     })
    //     .catch(function(err){
    //         console.log("Something Wrong");
    //         alert("Something Wrong");
    //         if (err.response && err.response.status === 401) {
    //             EventBus.dispatch("logout");
    //         }
    //     });
        
    // }

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
          {
            Header: "Title",
            accessor: "title",
          },
        //   {
        //     Header: "Content",
        //     accessor: "content",
        //   },
          {
            Header: "Author",
            accessor: "author_email",
          },
          {
            Header: "Last Update",
            accessor: "update_time",
          },
          {
            Header: "Actions",
            accessor: "actions",
            Cell: (props) => {
              const rowIdx = props.row.id;
              const author_email = postsRef.current[rowIdx].author_email;
            //   const post_id = postsRef.current[rowIdx].id;
            //   console.log('props: ' + props.row);
            //   console.log('author_email: ' + author_email);
            //   console.log('currentUser email: ' + currentUser.email);
              return(
                <div>
              <Button size="small" startIcon={<VisibilityIcon />} onClick={()=>viewPost(rowIdx)}></Button>
              {/* <Link to={`/view/${post_id}`} className="btn btn-success mx-2">View</Link> */}
              {currentUser && currentUser.email === author_email && (<Button size="small" startIcon={<EditIcon />} onClick={()=>editPost(rowIdx)}></Button>)}
              {currentUser && currentUser.email === author_email && (<Button size="small" startIcon={<DeleteIcon />} onClick={()=>handleDelete(rowIdx)}></Button>)}
              </div>
              );
            //   if(currentUser && author_email === currentUser.email) {
            //     return (
            //         <div>
            //             <span onClick={() => viewPost(rowIdx)}>
            //                 <i className="far fa-eye action mr-2"></i>
            //             </span>

            //             <span onClick={() => editPost(rowIdx)}>
            //                 <i className="far fa-edit action mr-2"></i>
            //             </span>
            
            //             <span onClick={() => deletePost(rowIdx)}>
            //                 <i className="fas fa-trash action"></i>
            //             </span>
            //         </div>
            //     );
            //   }
            //   else {
            //     return (
            //         <div>
            //             <span onClick={() => viewPost(rowIdx)}>
            //                 <i className="far fa-eye action mr-2"></i>
            //             </span>
            //         </div>
            //     );
            //   }
            },
          },
        ],
        [currentUser]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data: posts,
      });

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Term"
                value={searchTerm}
                onChange={onChangeSearchTerm}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByTerm}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
    
          <div className="col-md-12 list">
            <table
              className="table table-striped table-bordered"
              {...getTableProps()}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-3">
              <Pagination
                className="my-3"
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
              />
            </div>
            <div>
                <p><Link to="/createpost" className="btn btn-success">Create New Post</Link> </p>
            </div>
          </div>
        </div>
      );
     
//     return (
//     <div>
//         <div className="container h-100">
//             <div className="row h-100">
//                 <div className="col-12">
//                     <p><Link to="/createpost" className="btn btn-success">Create New Post</Link> </p>
//                     <h1>List Posts</h1>
//                     <table class="table table-bordered table-striped">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Title</th>
//                                 <th>Author</th>
//                                 <th>Update Time</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {posts.map((post, key) =>
//                                 <tr key={key}>
//                                     <td>{post.id}</td>
//                                     <td>{post.title}</td>
//                                     <td>{post.author_email}</td>
//                                     <td>{post.update_time}</td>
//                                     <td>
//                                         <NavLink to={`/view/${post.id}`} className="btn btn-success mx-2">View</NavLink>
//                                         {currentUser && currentUser.email === post.author_email && (<NavLink to={`/edit/${post.id}`} className="btn btn-info mx-2">Edit</NavLink>)}
//                                         {currentUser && currentUser.email === post.author_email && (<button onClick={()=>handleDelete(post.id)} className="btn btn-danger">Delete</button>)}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="container pb-5">
//                     <nav>
//                     <ul className="pagination justify-content-center">
//                         {info.prev_page != -1 ? (
//                         <li className="page-item">
//                             <button className="page-link" onClick={handlePreviousPage}>
//                             Previous
//                             </button>
//                         </li>
//                         ) : null}
//                         {info.next_page != -1 ? (
//                         <li className="page-item">
//                             <button className="page-link" onClick={handleNextPage}>
//                             Next
//                             </button>
//                         </li>
//                         ) : null}
//                     </ul>
//                     </nav>
//                 </div>
//             </div>       
//         </div>
//     </div>
//   );
};

export default ListPosts;