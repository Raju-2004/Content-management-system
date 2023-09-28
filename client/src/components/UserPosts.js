import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "./MyContext";
import BlogCard from "./BlogCard";
function UserPosts() {
  const { Posts, setPosts } = useContext(MyContext);
  const userEmail = localStorage.getItem("UserEmail");
  const [userPosts, setUserPosts] = useState([]);
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
  }, [setPosts]);

  useEffect(() => {
    const filteredPosts = Posts.filter(
      (p) => p.user && p.user.email === userEmail
    );
    setUserPosts(filteredPosts);
    console.log(filteredPosts);
  }, [Posts, userEmail]);
  if(userPosts.length ===0)
  {
    return (
        <div className="no-posts">
            <div className="text">you haven't created posts</div>
            <Link to="posts/create"><button className="button">create post</button></Link>
        </div>
    )
  }
  return (
      <div className="User-cards">
        {userPosts.length !== 0 ? (
          userPosts.map((b) => (
            <BlogCard
              key={b._id}
              id={b._id}
              title={b.title}
              description={b.description}
              creationDate={b.CreationDate}
              imageSrc={b.file}
            />
          ))
        ) : (
          <div className="no-blogs">No blogs in this category</div>
        )}
      </div>
  );
}

export default UserPosts;
