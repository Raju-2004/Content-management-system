import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext";


import { Link, Outlet } from "react-router-dom";
const Dashboard = () => {

  
  const { Posts,setPosts } = useContext(MyContext);
  
  // console.log(Posts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/dashboard/posts");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchPosts();
  }, [setPosts]);




  return (
    <div className="Dashboard">
      <div className="Navbar">
        <ul>
          <li>
            {/* onClick={onPostclick} */}
            <Link className="Links" to="/dashboard/posts">
              All posts
            </Link>
          </li>
          <li>
            <Link className="Links" to="posts/create">
              Create post
            </Link>
          </li>
          <li>
            <Link className="Links" to="/dashboard/categories">
              Categories
            </Link>
          </li>
          <li>
            <Link className="Links" to="/dashboard/comments">
            Comments
            </Link>
          </li>
        </ul>
      </div>
      <div className="outlet">
      <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
