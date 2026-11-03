const jwt = require('jsonwebtoken');
const userModel = require('../models/user')



const userAuth =  async (req ,res ,next)=>{
    //read the token from the req  cookies

   try{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("please log in");
    }
    // how do you verify it or 
    // validate the token
    const decodedObj = await jwt.verify(token ,"negi@123");
    const {_id} = decodedObj;
    //find the user-- that the user is valid or not like exist or not
    const user = await userModel.findById(_id);
    if(!user){
        throw new Error("user not found")
    }
    // after fiding the user i want to attach this to my req obj
    req.user = user;// so what will happen-->whatever the data i  found on the database i have attached to the request and calling next and in the proifle api request handler (req , res) it is already be present in the (req)
    next();   
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }


}
module.exports = {
    userAuth
};






























// dummy auth middleware
// const adminAuth = (req , res ,next)=>{
//     console.log("admin auth is getting checked");
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(400).send("unauthorized request");
//     }else {
//         next();
//     }
// };

// const userAuth = (req ,res ,next)=>{
//     console.log("auth user is getting checked");
//      const token = "xydjfhz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(400).send("unauthorized request");
//     }else {
//         next();
//     }
// }

// module.exports = {
//     adminAuth , userAuth
// };