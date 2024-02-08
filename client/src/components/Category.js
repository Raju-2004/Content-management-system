import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCanArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Category() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(null);

  const notify = () =>
    toast.success("category added", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const { CategoryValues, SetCategoryValues } = useContext(MyContext);

  // const [EditCategory,SetEditCategory] = useState({});
  const [button, SetButton] = useState("Create Category");

  const [Count, setCount] = useState(0);

  const [formData, setFormData] = useState({ title: "" });
  const handleChange = (e) => {
    const updatedForm = { ...formData };
    updatedForm.title = e.target.value;
    setFormData(updatedForm);
  };
  
  const handlePost = () => {
    const data = { title: formData.title };
    let method = "POST"; // Default to POST
    let url = "https://cms-42rf.onrender.com/dashboard/categories"
    if (button === "Edit Category") {
      url = `https://cms-42rf.onrender.com/dashboard/categories/edit/${currentId}`
      method = "PUT"; // Change to PUT if button text is 'Edit Category'
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        notify();
        navigate("/dashboard/categories")
        setCount((prevCount) => prevCount + 1);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleDelete = (categoryId) => {
    // Send a DELETE request to your backend to delete the category
    console.log(categoryId)
    fetch(`https://cms-42rf.onrender.com/dashboard/categories/delete/${categoryId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful deletion, e.g., remove the category from your state
        const updatedCategories = CategoryValues.filter((c) => c._id !== categoryId);
        SetCategoryValues(updatedCategories);
        toast.success("category deleted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }); // You can define a toast notification for deletion
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  
  useEffect(() => {
    // Fetch posts whenever count changes
    fetch("https://cms-42rf.onrender.com/dashboard/categories")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        SetCategoryValues(data);
        // setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [Count]);

  useEffect(() => {
    if (id) {
      setCurrentId(id);
      const editCategory = CategoryValues.find((c) => c._id === currentId);
      if (editCategory) {
        SetButton("Edit Category");
        setFormData({ title: editCategory.title });
      } else {
        SetButton("Create Category");
      }
    } else {
      setFormData({ title: "" });
      SetButton("Create Category");
    }
  }, [id, currentId, CategoryValues]);

  return (
    <div className="Category">
      <table className="Categories_table">
        <thead className="Category_head">
          <tr className="Category_headings">
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="Category_body">
          {CategoryValues.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td>

              <td>
                <Link to={"edit/" + c._id}>
                  <FontAwesomeIcon icon={faPenToSquare} shake />
                </Link>
                <Link
                    onClick={() => handleDelete(c._id)} // Pass the post ID to the delete function
                >
                  <FontAwesomeIcon icon={faTrashCanArrowUp} shake />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <div className="Category_form">
          <div className="Category_input">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="category-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Title"
            />
          </div>
          <button onClick={handlePost} className="Category_button" >{button}</button>
        </div>
    </div>
  );
}

export default Category;
