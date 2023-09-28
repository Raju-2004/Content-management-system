const express = require("express");
const router = express.Router();
const Post = require("../models/PostModal");
const Category = require("../models/CategoryModal");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});



router.get("/posts", (req, res) => {
  Post.find()
    .populate("category")
    .populate("user")
    .populate("comments")
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data); // Send a 200 OK response with JSON data
      } else {
        res.status(404).json({ error: "No data found" }); // Send a 404 JSON response if no data is found
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).json({ error: "Internal Server Error" }); // Send a 500 JSON response for database errors
    });
});

router.post("/posts", upload.single('file'), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new post object with data from the request body
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      allowComments: req.body.allowComments,
      category: req.body.category,
      file: req.file.path,  // Save the file path in the database
      user : req.body.user
    });

    // Save the post to the database
    const savedPost = await newPost.save();
    console.log(savedPost);
    res.status(201).json(savedPost); 
  } catch (error) {
    console.error("Error creating a new post:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});


router.get("/posts/create", (req, res) => {
  res.send("post created");
  console.log("route is visited");
});

router.put("/posts/edit/:id", (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      post.title = req.body.title;
      post.description = req.body.description;
      post.status = req.body.status;
      post.allowComments = req.body.allowComments;
      post.category = req.body.category;

      post
        .save()
        .then((updatedPost) => {
          res.json(updatedPost);
          console.log(post);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Internal server error", details: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", details: error });
    });
});

router.delete("/posts/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log(deletedPost.title);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


router.get("/categories", async (req, res) => {
  Category.find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data); // Send a 200 OK response with JSON data
      } else {
        res.status(404).json({ error: "No data found" }); // Send a 404 JSON response if no data is found
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).json({ error: "Internal Server Error" }); // Send a 500 JSON response for database errors
    });
});

router.post("/categories", async (req, res) => {
  var categoryName = req.body.title;
  if (categoryName) {
    const newCategory = new Category({
      title: categoryName,
    });
    newCategory.save().then((category) => {
      console.log("category added");
      res.status(200).json(category);
    });
  }
});


router.put("/categories/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title } = req.body;

    const category = await Category.findById(id);
    console.log(category.title)
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Validate and update the category title
    if (title && typeof title === "string") {
      category.title = title;
    } else {
      return res.status(400).json({ error: "Invalid category title" });
    }

    const updatedCategory = await category.save();
    console.log("Category updated");
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Add this route in your Express server
router.delete("/categories/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    // Check if the category exists
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});



module.exports = router;
