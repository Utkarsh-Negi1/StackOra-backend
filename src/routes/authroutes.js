const express = require('express');

// creating the  express router
const authRouter = express.Router();

const {validateSignUpData} =require('../utils/validation');
const UserModel = require("../models/user");
const validator = require('validator');
const bcrypt = require('bcrypt');

authRouter.post("/signup",async (req , res)=>{
   // when a user sign up things to do before creating the instance 
   //1.. Validation of the data
   try{
   validateSignUpData(req); 
   //2.. Encrypt the password in the database
   const {password , firstName , lastName , emailId} = req.body;
   const passwordHash = await bcrypt.hash(password , 10)
   
   //3..store the data in the database basically creating a new instance of the user model
   
   //creating a new instance of the user model
//   const user = new UserModel(req.body);-->
  // this is not the good way to pass the data instead of this we gave explicitly data
  const user = new UserModel({
   firstName,
    lastName,
     emailId,
     password : passwordHash,
});
      // now passing dynamic data into our api
    const savedUser = await user.save();
    const token = await savedUser.getJWT();//offload the logic to schema methods

         //Add the toke n to cookie and send the response to the user
         res.cookie("token",token, {expires :new Date(Date.now() + 8 * 3600000)});
        
   res.json({message : "user added succesfully", data : savedUser});

} catch (err){
   res.status(400).send( "ERROR : " + err.message);
}
  
});

// Creating  a Login API
authRouter.post("/login", async (req, res)=>{
   try{
      const {emailId , password} = req.body;
      if(!validator.isEmail(emailId)){
         throw new Error("please send the valid email id")
      }
      // the person wants to login it is even valid so for that
      const user = await UserModel.findOne({emailId : emailId});
      if(!user){
         throw new Error("invalid credintials")
      }
      //after that we have to check if the password and email is correct or not how ??
      // const isPasswordValid = await bcrypt.compare(password , user.password); offloaded to the userschema methods
      const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid){
         //here wright all the logic of jwt and cookies
         //create a JWT Token
         // const token = await jwt.sign({_id : user._id},"negi@123", {expiresIn :"1d"});
         const token = await user.getJWT();//offload the logic to schema methods

         //Add the toke n to cookie and send the response to the user
         res.cookie("token",token, {expires :new Date(Date.now() + 8 * 3600000)});
         res.send(user);
      }else{
         throw new Error("invalid credintials")
      }
   }
   catch (err){
   res.status(400).send( "ERROR : " + err.message);
}
});
// logout api
authRouter.post("/logout", async(req ,res)=>{
   try{
 res.cookie("token",null,{
      expires : new Date(Date.now()),// expires right now 
   });
   res.send("logout succesful");
   }

catch (err){
   res.status(400).send( "ERROR : " + err.message);
}
});
  


module.exports = authRouter;