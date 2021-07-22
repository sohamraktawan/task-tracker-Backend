const User = require("../models/UserModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const jsCookie = require("js-cookie")


let count = 0;
const handleErrors = (err) =>{
    //console.log(err.message, err.code);
    let errors = {email:'', password:'', username:''};
    let field;
    if(err.code === 11000){

        field=(Object.keys(Object.values(err)[4]));
        // console.log(field);

        if(field.length === 1){
            // console.log("yes");
            if(field[0]==='username'){
            // console.log("yes");
            errors.username = 'This username is already in use'
            // console.log(errors);

            }else if(field[0]==='email'){
            errors.email='This email already registered'
            }
        }else if(field.includes('username')){
            errors.username = 'This username is already in use'
        }else if(field.includes('email')){
            errors.email='This email already registered'
        }
    }else{
        console.log(err.errors.username);
        // Object.values(err.errors).forEach(({ properties }) => {
        //   console.log(val);
        //   console.log(properties);
        //   errors[properties.path] = properties.message;

        // });
        if(err.errors.username){
            errors.username=err.errors.username.message
        }
        if(err.errors.email){
            errors.email=err.errors.email.message
        }
        if(err.errors.password){
            errors.password=err.errors.password.message
        }



            
        }

        // console.log(errors);   
        return errors;

}

const handleErrors1 =(err)=>{
    
    let errors = {email:"", password:""}
    if(err.message === 'incorrect email'){
        console.log("yes")
        errors.email=err.message
    }
    if(err.message === 'incorrect password'){
        console.log("yes")
        errors.password=err.message
    }
    return errors
}

var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*36000

const createToken = (id) =>{
    return jwt.sign({ id }, 'soham post application secret',{
        expiresIn: expireTime
    });
};

let errors

module.exports.signup_get = (req, res) =>{

}

module.exports.signup_post = async (req, res) => {
    // res.header("Access-Control-Allow-Credentials", "true");
    // res.header("Access-Control-Allow-Origin","http://localhost:3000");
    let {username, email,password} = req.body;
    try{
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
        let postsLiked = []
        let postsDisliked = []
        const user = await User.create({username, email, password, postsLiked, postsDisliked});
        const token = createToken(user._id);
        res.send(token);
        res.status(201).json(user);
    }
    catch(err){
        console.log(err);
        errors = handleErrors(err);
        console.log(errors);
        res.status(201).json({errors:errors});

    }

}

module.exports.login_get = (req, res) =>{
    
}

module.exports.login_post = async (req, res) =>{
    const { email, password } = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.send(token);
        res.status(200).json({user: user._id})
    }
    catch (err){
        // console.log(err)
        errors = handleErrors1(err);

        res.status(201).json({errors:errors});
    }
}

module.exports.auth = async (req,res) =>{
    const token = req.body.token;
    count =  count+1;

    // console.log(count);
    let auth;
    jwt.verify(token, 'soham post application secret', async (err, decodedToken)=>{
        if(err){
            console.log("false")
            auth = "false"
            res.send(auth)

        }else{
            let user =  await User.findById(decodedToken.id)
            //console.log(user)
            auth = "true"
            res.send(user)
        }
    })
}