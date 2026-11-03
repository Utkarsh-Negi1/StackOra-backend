const express = require('express');

const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');


requestRouter.post("/request/send/:status/:toUserId" , userAuth , async(req , res)=>{
   try{
     // req.user is the logged in user and it is the user who is sending the request
     const fromUserId = req.user._id;
     const toUserId = req.params.toUserId;
     const status = req.params.status; //status is now dynamic

     //There are many flaws in the code like the status is only interested or ignored not accepted or rejected so we have to validate/ensure it 

     const allowedStatus = ["ignored","interested"];// only these two
     if(!allowedStatus.includes(status)){
      // sending response back
      return res.status(400).json({message : "invalid status type:"+ status});
     }
//1 case aur hai ki mai khud ko hi req bej rha hu isse bhi resolve krna h 

   //i have to check before sending the connection request that user is present in DB or not 
 //  kyuki ye tb toh kisi ki bhi id se requst bej dega ya kisi ko bhi bej dega jiski id db mai bhi nhi h 
// i am trying to find the existing user
     const toUser = await User.findById(toUserId);
     if(!toUser){
      return res.status(400).json({message : "user not found"})
     }


     // If there is an existing connection request means ex: maine ek bnde ko req beji and then mai usse dubara req nhi bej skta ex: if there is a existing connection req from A to B is already present type shit 
     //OR
     //if there is a connection request is pending from B to A 
     // i will never allowed to send the connection request 

     // this check must run BEFORE saving the new request, and it must use the MODEL (ConnectionRequestModel), not the instance
     const existingConnectionRequest = await ConnectionRequestModel.findOne({
      // or condition
      $or : [
         {fromUserId , toUserId},
         {fromUserId: toUserId , toUserId : fromUserId}
      ], 
     });
     if(existingConnectionRequest){
      return res.status(400).send({message : "connection request already exists"})
     }


     // creating a new instances 
     const connectionRequest = new ConnectionRequestModel({
      fromUserId , 
      toUserId,
      status
     });

     const data = await connectionRequest.save();
     res.json({
      message : req.user.firstName + " is" + status + " in" + toUser.firstName,
      data,
     })

   }
   catch(err){
      res.status(400).send("ERROR:"+ err.message)
   }

   });


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req ,res)=>{
       try{
         const loggedInUser = req.user;
         const {status , requestId} = req.params;

         //1.validate the status accepted or rejected
         const allowedStatus = ["accepted" , "rejected"]
         if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "status not allowed"})
         }
          //2.request Id should be valid means present in the DB
           //  rohit => utkarsh 
         //in this reciever person is the same person who is logged in person(utkarsh) in this request recieve (loggedInUser = toUserId)
         //status should be intersted bcz ignored ho gya toh vo change nhi ho skta interested hoga to request accept hogi yan hi hogi
          const connectionRequest = await ConnectionRequestModel.findOne({
            _id : requestId,
            toUserId : loggedInUser,
            status : "interested"
          });

          if(!connectionRequest){
            return res.status(404).json({ message: "connection request not found"});
          }

         connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message : "connection request " + status , data});
       } catch(err){
         res.status(400).send("ERROR : "+ err.message);
       }
})   

     
// requestRouter.post("/",userAuth ,  async (req ,res)=>{
//    const user = req.user;
// //    // logic -- sending the connection request
//    console.log("sending the connection  request");
//   res.send( user.firstName +  " sent the connection request")
// //    //if i want this api to get hit only when the user is logged in 
// });

module.exports = requestRouter;


// const express = require('express');

// const requestRouter = express.Router();
// const {userAuth} = require('../middlewares/auth');
// const ConnectionRequestModel = require('../models/connectionRequest');
// const User = require('../models/user');


// requestRouter.post("/request/send/:status/:toUserId" , userAuth , async(req , res)=>{
//    try{
//      // req.user is the logged in user and it is the user who is sending the request
//      const fromUserId = req.user._id;
//      const toUserId = req.params.toUserId;
//      const status = req.params.status; //status is now dynamic

//      //There are many flaws in the code like the status is only interested or ignored not accepted or rejected so we have to validate/ensure it 

//      const allowedStatus = ["ignored","interested"];// only these two
//      if(!allowedStatus.includes(status)){
//       // sending response back
//       return res.status(400).json({message : "invalid status type:"+ status});
//      }

//    //i have to check before sending the connection request that user is present in DB or not 
//  //  kyuki ye tb toh kisi ki bhi id se requst bej dega ya kisi ko bhi bej dega jiski id db mai bhi nhi h 
// // i am trying to find the existing user
//      const toUser = await User.findById(toUserId);
//      if(!toUser){
//       return res.status(400).json({message : "user not found"})
//      }


//      // creating a new instances 
//      const connectionRequest = new ConnectionRequestModel({
//       fromUserId , 
//       toUserId,
//       status
//      });

//      const data = await connectionRequest.save();
//      res.json({
//       message : "connection request sent succesfully",
//       data,
//      })

//    }
//    catch(err){
//       res.status(404).send("ERROR:"+ err.message)
//    }


//      // If there is an existing connection request means ex: maine ek bnde ko req beji and then mai usse dubara req nhi bej skta ex: if there is a existing connection req from A to B is already present type shit 
//      //OR
//      //if there is a connection request is pending from B to A 
//      // i will never allowed to send the connection request 

//      const existingConnectionRequest = await connectionRequest.findOne({
//       // or condition
//       $or : [
//          {fromUserId , toUserId},
//          {fromUserId: toUserId , toUserId : fromUserId}
//       ], 
//      });
//      if(existingConnectionRequest){
//       return res.status(400).send({message : "connection request already exists"})
//      }

//    })

     
// // requestRouter.post("/",userAuth ,  async (req ,res)=>{
// //    const user = req.user;
// // //    // logic -- sending the connection request
// //    console.log("sending the connection  request");
// //   res.send( user.firstName +  " sent the connection request")
// // //    //if i want this api to get hit only when the user is logged in 
// // });

// module.exports = requestRouter;