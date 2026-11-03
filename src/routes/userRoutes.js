const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');
const userRouter = express.Router();

//now making the user/requests api => job => get all the pending request for the logged in user
userRouter.get("/user/requests/received",userAuth, async(req ,res)=>{
    try{
        const loggedInUser = req.user;
        // FIX 1: await added, without it connectionRequests is just a Query object, not the data
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",["firstName","lastName" , "age" , "gender"]);

        // FIX 2: send the response back, earlier nothing was sent so postman kept on "Sending request..." forever
        res.json({
            message : "data fetched successfully",
            data : connectionRequests,
        });
    }
    catch(err){
        // FIX 3: it is res.status(...), not req.statusCode(...) (that itself throws an error)
        res.status(400).send("ERROR : " + err.message);
    }
});

userRouter.get("/user/connection",userAuth,async(req , res)=>{
    try{
          const loggedInUser = req.user;
          //for logged in user i have to get all the connection or how will i fetch the connection who are connected to me 
          //akshay => elon => accepted 
          //elon => mark => accepted 
          // i have to check all the connections where elon is the touserid or fromuserid but status should be accepted
          const connectionRequests = await ConnectionRequestModel.find({
            $or : [
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"},
            ]
          }).populate("fromUserId" ,["firstName" , "lastName"])
          .populate("toUserId" ,["firstName" , "lastName"]);


          const data = connectionRequests.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){// imp
                // FIX 4: toUserId alone is not defined, it lives on the row -> row.toUserId
                return row.toUserId;
            }
             return row.fromUserId;
          });

          res.json({data});


    }
    catch(err){
        res.status(400).send({message : err.message});

    }
  
});

userRouter.get("/user/feed", userAuth , async(req ,res)=>{
    try{
        //user can see all the cards(left/right swipe) of users in this app whom card he will not able to see are
        //1. his/her own card
        //2.his connection(friends)
        //3.ignored people
        //4.already sent the connection request

        const loggedInUser = req.user;

        const page = parseInt(req.query.page)|| 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ?50 :limit;
        const skip = (page-1)*limit;

        //find all the connection request either i have sent+recieved 
        const connectionRequests = await ConnectionRequestModel.find({
            $or : [{fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id}],
        }).select("fromUserId , toUserId")
        // .populate("fromUserId" ,"firstName")
        // .populate("toUserId" , "firstName");
        // mujhe yeh logg nhi chaiye uprr vale 65 line vale so i have to blocked/hide them
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })


        const users = await UserModel.find({
            $and : [{ _id:{$nin : Array.from(hideUsersFromFeed)},// converting set into the array from Array.from etc
             }
              ,{_id: { $ne : loggedInUser._id}}] // not equal ($ne ) $nin - not in this array
           
        }).select("firstName lastName")
        .skip(skip)
        . limit(limit);



        res.send(users);


    }
    catch(err){
        res.status(400).json({ message : err.message});
    }
})


module.exports = userRouter;








// const express = require('express');
// const { userAuth } = require('../middlewares/auth');
// const ConnectionRequestModel = require('../models/connectionRequest');
// const userRouter = express.Router();

// //now making the user/requests api => job => get all the pending request for the logged in user
// userRouter.get("/user/requests/received",userAuth, async(req ,res)=>{
//     try{
//         const loggedInUser = req.user;
//         // FIX 1: await added, without it connectionRequests is just a Query object, not the data
//         const connectionRequests = await ConnectionRequestModel.find({
//             toUserId : loggedInUser._id,
//             status : "interested"
//         }).populate("fromUserId",["firstName","lastName" , "age" , "gender"]);

//         // FIX 2: send the response back, earlier nothing was sent so postman kept on "Sending request..." forever
//         res.json({
//             message : "data fetched successfully",
//             data : connectionRequests,
//         });
//     }
//     catch(err){
//         // FIX 3: it is res.status(...), not req.statusCode(...) (that itself throws an error)
//         res.status(400).send("ERROR : " + err.message);
//     }
// });

// userRouter.get("/user/connection",userAuth,async(req , res)=>{
//     try{
//           const loggedInUser = req.user;
//           //for logged in user i have to get all the connection or how will i fetch the connection who are connected to me 
//           //akshay => elon => accepted 
//           //elon => mark => accepted 
//           // i have to check all the connections where elon is the touserid or fromuserid but status should be accepted
//           const connectionRequests = await ConnectionRequestModel.find({
//             $or : [
//                 {toUserId : loggedInUser._id , status : "accepted"},
//                 {fromUserId : loggedInUser._id , status : "accepted"},
//             ]
//           }).populate("fromUserId" ,["firstName" , "lastName"])
//           .populate("toUserId" ,["firstName" , "lastName"]);


//           const data = connectionRequests.map((row)=> {
//             if(row.fromUserId._id.toString() === loggedInUser._id.toString()){// imp
//                 // FIX 4: toUserId alone is not defined, it lives on the row -> row.toUserId
//                 return row.toUserId;
//             }
//              return row.fromUserId;
//           });

//           res.json({data});


//     }
//     catch(err){
//         res.status(400).send({message : err.message});

//     }
  
// })


// module.exports = userRouter;