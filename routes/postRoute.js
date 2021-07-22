const express = require("express");
const router = express.Router();
const Post = require("../models/PostsModel")
const User = require("../models/UserModel");

let post;
let user;
let count =0;


router.route('/create').post((req,res)=>{
    const timeStamp = req.body.timeStamp
    const username = req.body.username
    const title = req.body.title;
    const desc = req.body.desc;
    let likedBy = []
    let dislikedBy = []
    let likes= 0
    let dislikes = 0
    let comments = []
    let nocomments = 0


    const newPost = new Post({
        timeStamp,
        username,
        title,
        desc,
        likedBy,
        dislikedBy,
        likes,
        dislikes,
        comments,
        nocomments
    });

    newPost.save()
    .then(result=>{
        console.log("posted");
        res.end("done");
    })
    .catch(err=>{
        console.log(err);
    })
});

router.route('/posts').get((req, res)=>{
    Post.find()
    .then(foundposts=>{
        res.json(foundposts)
    })
    count =count +1;
    console.log(count)
})

router.route("/onepost").post((req,res)=>{
    Post.findById(req.body.id)
    .then(foundpost=>{
        res.send(foundpost)
    })

})




router.route("/upvote").post((req,res)=>{
    Post.findById(req.body.id)
    .then(res=>{
        post = res;
        post.likedBy.push(req.body.user)
        // console.log(post);
        post.likes = post.likes + 1;

        post.save()
        .then(res=>{
            // console.log("done");

    
        })
        .catch(err=>{
            console.log(err);
        })

    })

    User.findById(req.body.user)
    .then(res=>{
        user = res;
        user.postsLiked.push(req.body.id);
        // console.log(user)
        user.save()
        .then(res=>{
            // console.log("done")
        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err)
    })
});

router.route("/downvote").post((req,res)=>{
    Post.findById(req.body.id)
    .then(res=>{
        post = res;
        post.dislikedBy.push(req.body.user)
        // console.log(post);
        post.dislikes = post.dislikes + 1;
        post.save()
        .then(res=>{
            console.log("done");
    
        })
        .catch(err=>{
            console.log(err);
        })

    })

    User.findById(req.body.user)
    .then(res=>{
        console.log( "res", res)
        user = res;
        user.postsDisliked.push(req.body.id);
        // console.log(user)
        user.save()
        .then(res=>{
            // console.log("done")
        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err)
    })
});

router.route("/undownvote").post((req,res)=>{
    Post.findById(req.body.id)
    .then(res=>{
        post = res;
        post.dislikedBy = post.dislikedBy.filter(e=>{
            return e!==req.body.user
        })
        post.dislikes = post.dislikes - 1;
        // console.log(post);
        post.save()
        .then(res=>{
            // console.log("removed");
    
        })
        .catch(err=>{
            console.log(err);
        })

    })

    User.findById(req.body.user)
    .then(res=>{
        user = res;
        user.postsDisliked = user.postsDisliked.filter(e=>{
            return e!==req.body.id
        })
        console.log(user)
        user.save()
        .then(res=>{
            // console.log("removed")
        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err)
    })
});

router.route("/unupvote").post((req,res)=>{
    Post.findById(req.body.id)
    .then(res=>{
        post = res;
        // console.log(req.body.user)
        post.likedBy = post.likedBy.filter(e=>{
            return e!==req.body.user
        })
        post.likes = post.likes - 1;
        // console.log(post);
        post.save()
        .then(res=>{
            // console.log("removed");
    
        })
        .catch(err=>{
            console.log(err);
        })
    })

    User.findById(req.body.user)
    .then(res=>{
        user = res;
        // console.log(user)
        user.postsLiked = user.postsLiked.filter(e=>{
            return e!==req.body.id
        })
        // console.log(user)
        user.save()
        .then(res=>{
            // console.log("removed")
        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err)
    })
});

router.route("/delete").post((req,res)=>{
    Post.findByIdAndDelete(req.body.id)
    .then(res=>{
    console.log(res)
    })
    .catch(err=>{
        console.log(err);
    })


    User.findById(req.body.user)
    .then(res=>{
        user = res;
        // console.log(user)
        if(user.postsLiked.includes(req.body.id)){
        user.postsLiked = user.postsLiked.filter(e=>{
            return e!==req.body.id
        })}
        if(user.postsDisliked.includes(req.body.id)){
            user.postsDisliked = user.postsDisliked.filter(e=>{
                return e!==req.body.id
            })}
        // console.log(user)
        user.save()
        .then(res=>{
            // console.log("removed")
        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err)
    })
});

router.route("/comment").post((req,res)=>{
    console.log(req.body)
    Post.findById(req.body.id)
    .then(res=>{
        post=res;
        post.comments.push({user:req.body.user, comment:req.body.comment});
        post.nocomments = post.nocomments + 1;
        console.log(post)
        post.save()
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
        
    })
    .catch(err=>{
        console.log(err);
    })

});





module.exports = router;