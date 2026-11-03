// defining wht a user in database is ..

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema =  new mongoose.Schema({
    firstName : {
        type : String,
        required: true 
    },
    lastName :{
        type : String
    },
    emailId : {
        type : String,
        required: true,
        lowercase : true,
        index : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address" + value);
            }
        }

    },
    password :{
        type : String,
        required: true,
        //  validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("not strong password" + value);
        //     } 

    // }
},
    age : {
        type : String
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
    photoUrl:{
        type : String,
    },
    about:{
        type : String,
        default : " this is the default about"
    },
    skills:{
        type : [String],
    }
},
{
    timestamps : true,
});
// user schema methods(helpers)
// dont use arrow function it will break things up
userSchema.methods.getJWT =  async function (){
    const user = this;
  
 const token =  await jwt.sign({_id : user._id},"negi@123", {expiresIn :"1d"});
 return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}


 const UserModel =  new mongoose.model("user",userSchema);


 module.exports = UserModel;