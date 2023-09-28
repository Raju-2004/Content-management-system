const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PostSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
  },
  description: {
    type: String,
    required: true,
  },
  CreationDate: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  },
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref :"comments",
      default :[]
    },
  ],
  allowComments :{
    type:Boolean,
    default :false
  }
  ,
  file :{
    type:String,
    default :''
  }
});

const Post = mongoose.model("Posts", PostSchema);
module.exports = Post;
