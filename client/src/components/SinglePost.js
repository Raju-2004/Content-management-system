import React, { useEffect, useState, useContext } from "react";
import { Link, useParams ,useNavigate} from "react-router-dom";
import { MyContext } from "./MyContext";
import { toast } from "react-toastify";

function SinglePost() {
  const [post, setPost] = useState({});
  const { Posts, setPosts } = useContext(MyContext);
  const userEmail = localStorage.getItem('UserEmail');
  const [users, setUsers] = useState([]);
  const [commenter, setCommenter] = useState({}); // State for commenter name
  const [comment, setComment] = useState("");
  const [count,setCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState(null);
  const params = useParams();
  const [imagePath, setImagePath] = useState(
    "https://www.patterns.dev/img/reactjs/react-logo@3x.svg"
  );

  const navigate = useNavigate();
  const isUserLoggedIn = !!userEmail;
  useEffect(() => {
    fetch("https://cms-42rf.onrender.com/dashboard/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [setPosts]);

  useEffect(() => {
    const filteredPost = Posts.find((p) => p._id === params.id);
    if (filteredPost) {
      setPost(filteredPost);
      setPostId(filteredPost._id);
    }
  }, [params, Posts]);

  useEffect(() => {
    if (post.file) {
      const correctedImagePath = post.file.replace(/\\/g, "/");
      setImagePath("https://cms-42rf.onrender.com/" + correctedImagePath);
    }
  }, [post.file]);

  // Format the date
  const formattedDate = post && post.CreationDate
    ? new Date(post.CreationDate).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
    : "Loading...";

  useEffect(() => {
    fetch("https://cms-42rf.onrender.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Fetch users only once, no need to fetch on userEmail change

  useEffect(() => {
    // Set the commenter name based on userEmail
    const filteredUser = users.find((user) => user.email === userEmail);
    if (filteredUser) {
      setCommenter(filteredUser);
    }
  }, [userEmail, users]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`https://cms-42rf.onrender.com/blogs/post/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, body: comment, user_id: commenter._id}), // Assuming userPosts is an array
    })
      .then((response) => response.json())
      .then((data) => {
        setCount((prevCount) => prevCount + 1);
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, data],
        }));
        setComment(""); // Clear the comment input
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  useEffect(() => {
    fetch(`https://cms-42rf.onrender.com/blogs/post/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [postId,count]);
  
  const onHandleClick = ()=>{
    if(!isUserLoggedIn)
    {
      toast.info(' You must be sign up or log in!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/")
    }
  }

  return (
    <div className="single-post">
      {post && post.title ? (
        <div className="Post">
          <div className="post-title">
            <h1>{post.title}</h1>
          </div>
          <div className="post-details">
            <p className="post-info">
              by{" "}
              <Link to="#">
                {post.user
                  ? post.user.firstName + " " + post.user.lastName
                  : "kusaRaju"}
              </Link>
            </p>
            <p className="post-date">Posted on {formattedDate}</p>
            <div className="single-post-image">
              <img
                src={imagePath}
                alt={post.title}
                className="post-image"
                style={{ height: 250 }}
              />
            </div>
            <p className="post-description">{post.description}</p>
            {post.allowComments === true ? (
              <div className="Comment-details">
                <div className="post-comment">
                  <h5>Leave a Comment:</h5>
                  <div className="comment-form">
                    <form onSubmit={handleSubmit}>
                      <textarea
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <button onClick={onHandleClick} className="submit-button" type="submit">Submit</button>
                    </form>
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>Comments:</div>
                {comments.length>0 && comments.map((c) => (
                  <div className="commenter-info" key={c._id}>
                    <img
                      src="http://placehold.it/50x50"
                      alt="Commenter"
                      className="commenter-image"
                    />
                    <div className="commenter-details">
                      <h5>{c.user && c.user.email} {c.date}</h5> {/* Use commenter state here */}
                      <p>
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Comments are not allowed</div>
            )}
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
}

export default SinglePost;
