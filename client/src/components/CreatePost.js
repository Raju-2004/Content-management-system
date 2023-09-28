import React, { useState, useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import { toast } from 'react-toastify';

function CreatePost() {
  const { CategoryValues, SetCategoryValues } = useContext(MyContext);
  const [Users, SetUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/dashboard/categories')
      .then((response) => response.json())
      .then((data) => {
        SetCategoryValues(data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });

    fetch('http://localhost:4000/users')
      .then((response) => response.json())
      .then((data) => {
        SetUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const notify = () =>
    toast.success('New post created', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const [formData, setFormData] = useState({
    title: '',
    status: 'public',
    category: CategoryValues.length > 0 ? CategoryValues[0]._id : '',
    allowComments: false,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return alert('Please select a file.');
    }

    const email = localStorage.getItem('UserEmail');
    const user = Users.find((u) => u.email === email);

    if (!email || !user) {
      alert('User is not logged in or user information is missing.');
      return;
    }

    const url = 'http://localhost:4000/dashboard/posts';

    const data = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      allowComments: formData.allowComments,
      category: formData.category,
      user: user._id,
    };

    const formDataWithFile = new FormData();
    formDataWithFile.append('file', selectedFile);

    for (const key in data) {
      formDataWithFile.append(key, data[key]);
    }

    const requestOptions = {
      method: 'POST',
      body: formDataWithFile,
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        notify();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        console.error('Response status:', error.response ? error.response.status : 'Unknown');
        console.error('Response message:', error.response ? error.response.statusText : 'Unknown');
      });
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div className="Form_title">
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
        <label>File Upload</label>
        <input
          type="file"
          id="file"
          name="uploadedFile"
          accept="image/jpeg, image/jpg, image/png, image/bmp"
          onChange={handleFileChange}
        />
      </div>

      <div className="Form_Status">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="Form_Category">
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          {CategoryValues.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="Form_checkbox">
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
        Create Post
      </button>
    </form>
  );
}

export default CreatePost;
