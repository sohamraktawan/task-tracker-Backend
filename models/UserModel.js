const mongoose = require("mongoose");
const { isEmail, isEmpty, isStrongPassword } = require("validator")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter an username'],
        unique: true,

    },
    email:{
        type: String,
        required:[true, "Please enter an email"],
        unique: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password:{
        type: String,
        
        required: [true, 'Please enter a password'],
        minlength: [6, "The password should be atleast 6 characters long"],
        validate:[isStrongPassword, 'Please enter a  strong password']

    },

}, {versionKey:false})

// UserSchema.pre('save', async function(next){
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
// });

UserSchema.statics.login = async function(email,password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        console.log(password)
        console.log(user.password)

        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', UserSchema);

module.exports = User;