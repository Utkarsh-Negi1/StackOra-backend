const express = require('express');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData ,validatePasswordChangeData } = require('../utils/validation')


 profileRouter.get("/profile/view",userAuth, async(req ,res)=>{
//whenever will be profile api will be called -now i want to validate the cookie
   //how to get the cookie is 
 try{

 // all happen in the middleware
// now i will verify this token or validate this token

// sending the user back from server
//so what will happen-->whatever the data i  found on the database i have attached to the request and calling next and in the proifle api request handler (req , res) it is already be present in the (req)
 // so now i dont want to make this database call again so; 
 // const user = await UserModel.findById(_id);
 const user = req.user;

res.send(user);
 }catch {
       res.status(400).send("something went wrong")
   }
 });


 profileRouter.patch("/profile/edit",userAuth , async(req ,res)=>{
  // first i will do data sanitization and data validation
  try{
if(!validateEditProfileData(req)){
    throw new Error("invalid edit request")
   }
   const loggedInuser = req.user;
   // now edit the loggedinuser
   Object.keys(req.body).forEach((key)=>(loggedInuser[key] = req.body[key]));
 await loggedInuser.save();
  //  res.send(`${loggedInuser.firstName} your profile updated succesfully`);
  res.json({
    message :
    ` ${loggedInuser.firstName} your profile  is updated succesfully`,
    data :loggedInuser
  } )
}
  catch (err){
    res.status(400).send("ERROR : "+ err.message);
  }
 })

 // Change password (user must be logged in)
// Body: { "currentPassword": "...", "newPassword": "..." }
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
   try {
      // 1. Data validation (throws an error if anything is wrong)
      validatePasswordChangeData(req);
 
      const { currentPassword, newPassword } = req.body;
      const loggedInuser = req.user;
 
      // 2. Verify the current password (same schema method the login uses)
      const isCurrentPasswordValid = await loggedInuser.validatePassword(currentPassword);
      if (!isCurrentPasswordValid) {
         throw new Error("current password is incorrect");
      }
 
      // 3. Hash and save the new password
      loggedInuser.password = await bcrypt.hash(newPassword, 10);
      await loggedInuser.save();
 
      // 4. Log the user out so they login again with the new password
      res.cookie("token", null, { expires: new Date(Date.now()) });
 
      res.json({
         message: `${loggedInuser.firstName} your password is updated successfully, please login again`,
      });
   } catch (err) {
      res.status(400).send("ERROR : " + err.message);
   }
});


module.exports = profileRouter;