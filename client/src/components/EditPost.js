import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "./MyContext";
function EditPost() {
  const { Posts, CategoryValues, SetCategoryValues } = useContext(MyContext);
  const { id } = useParams();

  useEffect(() => {
    // Fetch categories whenever the component mounts
    fetch("http://localhost:4000/dashboard/categories")
      .then((response) => response.json())
      .then((data) => {
        SetCategoryValues(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  // console.log(CategoryValues)

  const foundPost = Posts.filter((post) => post._id === id);
  const initialCategoryID = foundPost[0].category
    ? foundPost[0].category._id
    : "";
  // const initialCategoryTitle = foundPost[0].category ? foundPost[0].category.title : "";
  // console.log(foundPost)
  const notify = () =>
    toast.success("post updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [formData, setFormData] = useState({
    title: foundPost[0].title,
    uploadedFile: null, // Initialize with the correct value
    status: foundPost[0].status,
    allowComments: foundPost[0].allowComments,
    category: initialCategoryID,
    description: foundPost[0].description,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = `http://localhost:4000/dashboard/posts/edit/${id}`;

    const data = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      allowComments: formData.allowComments,
      category: formData.category,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    // Use the fetch method to send the PUT request
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        notify();
        console.log(data);
        // Handle the successful response here
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error, e.g., display an error message to the user
      });
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div className="Form_title">
        {" "}
        {/* Update class name here */}
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter The Title"
        />
      </div>

      <div className="Form_File">
        {" "}
        {/* Update class name here */}
        <label>File Upload</label>
        <input
          type="file"
          id="file"
          name="uploadedFile"
          accept="image/jpeg, image/jpg, image/png, image/bmp"
          onChange={handleChange}
        />
      </div>

      <div className="Form_Status">
        {" "}
        {/* Update class name here */}
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="Form_Category">
        {" "}
        {/* Update class name here */}
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {CategoryValues.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="Form_checkbox">
        {" "}
        {/* Update class name here */}
        <label>
          <input
            type="checkbox"
            id="allowComments"
            name="allowComments"
            checked={formData.allowComments}
            onChange={handleChange}
          />
          Allow Comments
        </label>
      </div>

      <div className="Form_content">
        {" "}
        {/* Update class name here */}
        <label>Content</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter your content here"
          rows="10"
        ></textarea>
      </div>

      <button className="Form_button" type="submit">
        {" "}
        {/* Update class name here */}
        Create Post
      </button>
    </form>
  );
}

export default EditPost;
