const express = require("express");
const Comment = require('../models/CommentModal')
const Post = require('../models/PostModal')
const router = express.Router();

router.get('post/:id',async(req,res)=>{
    const id = req.params.id;
    const post = await Post.findById(id);
})

router.get('/post/:id/comments', async (req, res) => {
    try {
      const postId = req.params.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  

      const comments = await Comment.find({ _id: { $in: post.comments } }).populate("user");
      // console.log(comments);
      res.json(comments);
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ message: "Server error" });
    }
});


router.post('/post/:id/comments', async (req, res) => {
    try {
      const { postId, body, user_id } = req.body;
      console.log(req.body);
      

      const newComment = new Comment({
        post:postId,
        body: body,
        user: user_id, 
      });
  
      await newComment.save();

  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      post.comments.push(newComment);
      await post.save();
  
      res.json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;