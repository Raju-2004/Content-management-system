import React, { useContext, useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { MyContext } from "./MyContext";
import { Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

function Blogs() {
  const useremail = localStorage.getItem('UserEmail');
  const isUserLoggedIn = !!useremail;
  const navigate = useNavigate();
  const { Posts, setPosts,CategoryValues,SetCategoryValues} = useContext(MyContext);
  const [FilteredPosts,setFilteredPosts] = useState(Posts);
  console.log(FilteredPosts);
  const [inputText,setInputText] = useState("")
  console.log(inputText);
  useEffect(() => {
    fetch("http://localhost:4000/dashboard/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
      fetch('http://localhost:4000/dashboard/categories')
      .then((response) => response.json())
      .then((data) => {
        SetCategoryValues(data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [setPosts,SetCategoryValues]);
  const onHandleClick = ()=>{
    if(isUserLoggedIn)
    {
      navigate("/dashboard/posts/create");
    }
    else{
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
  const onSearchClick = ()=>{
    const input = inputText.toLowerCase();
     const filteredPosts = input &&  Posts.filter((post) =>
     post.title.toLowerCase().includes(input)
   );

   // Update the state with the filtered result
   setFilteredPosts(filteredPosts);
  }
  const onCategoryClick = (title)=>{
    const filteredPosts = title &&  Posts.filter((post) =>
    post.category.title.toLowerCase().includes(title.toLowerCase())
  );

  // Update the state with the filtered result
  setFilteredPosts(filteredPosts);
  }
  return (
    <div className="Blogs">
      <div className="card">
        {FilteredPosts.length !==0 ?FilteredPosts.map((b) => (
          <BlogCard
            key={b._id}
            id={b._id}
            title={b.title}
            description={b.description}
            creationDate={b.CreationDate}
            imageSrc={b.file}
          />
        )):(<div className="no-blogs">No blogs in this category</div>)}
      </div>
      <div className="sidebar">
        <form className="form">
          <div id="searchBox">
            <div id="searchBoxTitle">Search the Blog</div>
            <div id="searchField">
              <input type="text" name="searchText" id="searchText" value={inputText} onChange={(e)=>{setInputText(e.target.value)}}/>
              <Link name="searchBtn"
                className="searchTheBlog"
                onClick={onSearchClick}
              ><i className="fa-solid fa-search"></i></Link>
            </div>
          </div>
        </form>
        <div className="categoryBox">
          <div id="categoryTitle">Blog Categories</div>
          <ul>
          {CategoryValues.map((b) => (
            <Link key={b._id} onClick={() => onCategoryClick(b.title)}><li>{b.title}</li></Link>
            ))}
          </ul>
        </div>
        <Link onClick={onHandleClick}>
        <button type="submit" className="createBlogBtn">
          <i className="fa-solid fa-pen-to-square"></i>
          Write Your Creative Blog
        </button>
        </Link>
      </div>
    </div>
  );
}

export default Blogs;
