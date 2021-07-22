const express = require("express");
const router = express.Router();
const Task = require("../models/TasksModel")
const User = require("../models/UserModel");




router.route('/create').post((req,res)=>{
    const timeDue = req.body.timeDue
    const username = req.body.username
    const title = req.body.title;
    const desc = req.body.desc;
    const priority = req.body.priority;
    const status = "assigned"

    const newTask = new Task({

        username,
        title,
        desc,
        timeDue,
        priority,
        status
        
    });

    newTask.save()
    .then(result=>{
        console.log("posted");
        res.end("done");
    })
    .catch(err=>{
        console.log(err);
    })
});

router.route('/tasks').get((req, res)=>{
    Task.find()
    .then(foundtasks=>{
        res.json(foundtasks)
    })
})

router.route("/complete").post((req,res)=>{
    let id = req.body.id
    Task.findById(id)
    .then(res=>{
        let task = res
        if(task.timeDue-Date.now()>0){
            task.status = "completed"
        }else if(task.timeDue-Date.now()<=0){
            task.status = "completed-late"
        }

        task.save()
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.route("/delete").post((req,res)=>{
    let id = req.body.id
    Task.findByIdAndDelete(id)
    .then(res=>{
        console.log(res)
    })
    .catch(err=>{
        console.log(err)
    })
})





module.exports = router