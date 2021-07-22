const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    timeStamp: String,
    username: String,
    title: String,
    desc: String,
    likedBy:[String],
    dislikedBy:[String],
    likes:Number,
    dislikes:Number,
    comments:[{user:String, comment:String}],
    nocomments:Number

},{versionKey:false})

const Post = mongoose.model("post", PostSchema);

module.exports = Post;