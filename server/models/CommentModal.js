const mongoose = require('mongoose')
const schema = mongoose.Schema;

const CommentSchema = new schema({
    body:{
        type : String,
        required :true
    },
    post :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    },
    user :{
        type :mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    date :{
        type:Date,
        default :Date.now()
    },
    commentIsApproved :{
        type : Boolean,
        default : false
    }

})

const Comment = mongoose.model("comments",CommentSchema);
module.exports = Comment;