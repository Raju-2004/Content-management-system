import React, { useContext, useEffect,useState } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import { MyContext } from "./MyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCanArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
function Posts({ post }) {
  const navigate = useNavigate();
  const { Posts, setPosts } = useContext(MyContext);
  const userEmail = localStorage.getItem('UserEmail');
  const [userPosts,setUserPosts] = useState([]);
  const onClickHandler = () => {
    navigate("");
  };

  const handleDelete = (postId) => {
    fetch(`http://localhost:4000/dashboard/posts/delete/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting post (HTTP ${response.status})`);
        }
        // If the deletion was successful, update the Posts state to remove the deleted post
        return response.json();
      })
      .then(() => {
        const updatedPosts = Posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts);

        toast.success("post deleted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Rest of the code
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };
  
  useEffect(() => {
    // Fetch posts whenever the posts button clicks
    fetch("http://localhost:4000/dashboard/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  
  useEffect(()=>{
    const filteredPosts = Posts.filter((p) =>p.user && p.user.email === userEmail )
    setUserPosts(filteredPosts)
    console.log(filteredPosts);
  },[Posts, userEmail])
  return (
    <div className="Posts">
      <table className="Posts_table">
        <thead className="Posts_table_head">
          <tr className="Headings">
            <th>Title</th>
            {/* <th>Description</th> */}
            <th>Status</th>
            <th>Comments Allowed</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="Posts_table_body">
          {userPosts.length > 0 &&
            userPosts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                {/* <td>{p.description}</td> */}
                <td>{p.status}</td>
                <td>{"" + p.allowComments}</td>
                <td>{p.category ? p.category.title : 'N/A'}</td>
                <td>
                  <Link to={"edit/" + p._id} onClick={onClickHandler}>
                    <FontAwesomeIcon icon={faPenToSquare} shake />
                  </Link>
                  <Link
                      onClick={() => {
                        handleDelete(p._id); // Pass the post ID to the delete function
                      }}
                  >
                    <FontAwesomeIcon icon={faTrashCanArrowUp} shake />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Posts;
