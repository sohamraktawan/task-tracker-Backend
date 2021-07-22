const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    username:String,
    title:String,
    desc:String,
    timeDue:Number,
    priority:String,
    status:String




},{versionKey:false})

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;