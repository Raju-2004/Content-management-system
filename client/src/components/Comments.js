import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "./MyContext";
function Comments() {
const { Posts, setPosts } = useContext(MyContext);
  const userEmail = localStorage.getItem("UserEmail");
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    // Fetch posts whenever the posts button clicks
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
    const filteredPosts = Posts.filter(
      (p) => p.user && p.user.email === userEmail
    );
    setUserPosts(filteredPosts);
    console.log(filteredPosts);
  }, [Posts, userEmail]);
  return (
    <div className="Posts">
      <table className="Posts_table">
        <thead className="Posts_table_head">
          <tr className="Headings">
            <th>Title</th>
            <th>allowComments</th>
            <th>No.of comments</th>
            {/* <th>body</th> */}
          </tr>
        </thead>
        <tbody className="Posts_table_body">
          {userPosts.length > 0 &&
            userPosts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{"" + p.allowComments}</td>
                <td>{p.comments.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Comments