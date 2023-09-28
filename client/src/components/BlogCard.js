import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function BlogCard({id, title, description, creationDate, imageSrc }) {
  // const {Posts,setPosts} = useContext(MyContext);
  const [expanded, setExpanded] = useState(false);
  const [imagePath, setImagePath] = useState(
    "https://www.patterns.dev/img/reactjs/react-logo@3x.svg"
  ); // Default or fallback image path

  const [iconClicked, setIconClicked] = useState(false);
  useEffect(() => {
    if (imageSrc) {
      const correctedImagePath = imageSrc.replace(/\\/g, "/");
      setImagePath("http://localhost:4000/" + correctedImagePath);
      // console.log(imagePath);
    }
  }, [imagePath, imageSrc]);

  /* console.log(imagePath); */

  const handleIconClick = () => {
    setIconClicked(!iconClicked);
  };

  return (
    <div className="blog-card">
      <img
        style={{ height: 250, width: 320 }}
        src={imagePath}
        alt="Paella dish"
        className="blog-card-image"
      />
      <div className="blog-card-content">
        <h2 className="blog-card-title">{title}</h2>
        <p className="blog-card-date">{creationDate}</p>
        {/* <p className="blog-card-description">{description}</p> */}
      </div>
      <div className="blog-card-actions">
        <i
          className="fa-solid fa-heart fav-icon"
          style={{ color: iconClicked ? "red" : "white" }}
          onClick={handleIconClick}
        ></i>
        <Link to={"post/"+id} className="blog-card-button"> 
          Read more
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
