const express = require("express");

 const connectDB = require("./config/database");//imp line 
 const app = express();
 const cookieParser = require('cookie-parser');
 const cors = require("cors");
 // ---------------------------------------------------------------
// FIX 1 (the actual cause of your error):
// Middlewares MUST be registered BEFORE the routers.
// Express runs things top to bottom, so if app.use("/", authRouter)
// comes first, the request reaches /signup before express.json()
// has parsed the body -> req.body is undefined.
// ---------------------------------------------------------------
app.use(express.json());   // parses JSON body -> req.body
app.use(cookieParser());   // parses cookies   -> req.cookies
app.use(cors({
   origin:"http://localhost:5173",
   credentials : true,
}));

 

// const UserModel = require("./models/user");

// const {validateSignUpData} =require('./utils/validation');
// const bcrypt = require('bcrypt');
// const validator = require('validator');

const jwt = require('jsonwebtoken');

const authRouter = require('./routes/authroutes');
const requestRouter = require('./routes/requestsroutes');
const profileRouter = require('./routes/profileroutes');
const userRouter = require("./routes/userRoutes");
 
// Routers AFTER middlewares
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

// const {userAuth} = require('./middlewares/auth')
// now this userauth middleware kisi bhi api mai lgyegi to usse strong bna degi








// // app.use((req,res)=>{
// //     res.send("hello from the server!!!!")
// // });
// // app.get("/users",(req,res)=>{
// //     res.send("hello test this side !!!!")
// //  });
// //  app.post("/users",(req,res)=>{
// //     //saving data to database
// //     res.send("saved the data !!!!")
// //  });
// //  app.delete("/users",(req,res)=>{
// //     res.send("deleted succesfully !!!!")
// //  });
// //  app.use("/test",(req,res)=>{
// //     res.send("hello test this side !!!!")
// //  });
// // app.use("/hello",(req,res)=>{
// //     res.send("hello this is utkarsh !!!!")
// // });
// // app.use("/test/2",(req,res)=>{
// //     res.send("hello test222222222 this side !!!!")
// // });

// // app.use("/make",(req,res)=>{
// //     res.send("hello make here!!!!")
// // });

// // app.use("/",(req,res)=>{
// //     res.send("hello hello hello!!!!")
// // });







// // handling multiple route handlers using single routes 

// // using the next();

// // app.use("/users",[(req ,res,next)=>{
// //    console.log("handler routes 1");
// //    // res.send("1st response");
// //    next();
// // },
// // (req ,res, next )=>{
// //    console.log("handler routes 2");
// //    // res.send("2st response");
// //    next();
// // },
// // (req ,res,next)=>{
// //    console.log("handler routes 3");
// //    // res.send("3st response");
// //    next();
   
// // },
// // (req ,res,next)=>{
// //    console.log("handler routes 4");
// //     res.send("4st response");
// // }]);

// // do array also














// // validlations 
// // app.get("/admin/getAllData",(req, res)=>{
// //    //logic of checking if the request is authorized
// //    const token = "xyz";
// //    const isAdminAuthorizes = token === "xyz";
// //    if(isAdminAuthorizes){
// //       res.send("all data sent");
// //    }else{
// //       res.status(401).send("unauthorized request")
// //    }
// // })









//Error handling 

// app.get("/getUserData",(req ,res)=>{
//    //logiv of db  call and get user data 
//    throw new Error("kfdjsghdfj");
//    res.send("data sent!!!")
// });

// app.use("/",(err,req, res , next)=>{
//    if(err){
//       res.status(500).send("something went wrong")
//    }
// })


//creating a first API in the database

// midlleware
// app.use(express.json());

// app.use(cookieParser()); // middleware

// app.post("/signup",async (req , res)=>{
//    // when a user sign up things to do before creating the instance 
//    //1.. Validation of the data
//    try{
//    validateSignUpData(req); 
//    //2.. Encrypt the password in the database
//    const {password , firstName , lastName , emailId} = req.body;
//    const passwordHash = await bcrypt.hash(password , 10)
   
//    //3..store the data in the database basically creating a new instance of the user model
   
//    //creating a new instance of the user model
// //   const user = new UserModel(req.body);-->
//   // this is not the good way to pass the data instead of this we gave explicitly data
//   const user = new UserModel({
//    firstName,
//     lastName,
//      emailId,
//      password : passwordHash,
// });
//       // now passing dynamic data into our api
//    await user.save();
//    res.send("user added succesfully");

// } catch (err){
//    res.status(400).send( "ERROR : " + err.message);
// }
  
// });

// // Creating  a Login API
// app.post("/login", async (req, res)=>{
//    try{
//       const {emailId , password} = req.body;
//       if(!validator.isEmail(emailId)){
//          throw new Error("please send the valid email id")
//       }
//       // the person wants to login it is even valid so for that
//       const user = await UserModel.findOne({emailId : emailId});
//       if(!user){
//          throw new Error("invalid credintials")
//       }
//       //after that we have to check if the password and email is correct or not how ??
//       // const isPasswordValid = await bcrypt.compare(password , user.password); offloaded to the userschema methods
//       const isPasswordValid = await user.validatePassword(password);
//       if(isPasswordValid){
//          //here wright all the logic of jwt and cookies
//          //create a JWT Token
//          // const token = await jwt.sign({_id : user._id},"negi@123", {expiresIn :"1d"});
//          const token = await user.getJWT();//offload the logic to schema methods

//          //Add the toke n to cookie and send the response to the user
//          res.cookie("token",token, {expires :new Date(Date.now() + 8 * 3600000)});
//          res.send("login succesfull")
//       }else{
//          throw new Error("invalid credintials")
//       }
//    }
//    catch (err){
//    res.status(400).send( "ERROR : " + err.message);
// }
// });

// // addign mmiddleware before passing the request handler
// app.get("/profile",userAuth, async(req ,res)=>{
//    //whenever will be profile api will be called -now i want to validate the cookie
//    //how to get the cookie is 
// try{

// // all happen in the middleware
// // now i will verify this token or validate this token

// // sending the user back from server
// //so what will happen-->whatever the data i  found on the database i have attached to the request and calling next and in the proifle api request handler (req , res) it is already be present in the (req)
// // so now i dont want to make this database call again so;
// // const user = await UserModel.findById(_id);
// const user = req.user;

// res.send(user);
// }catch {
//       res.status(400).send("something went wrong")
//    }
// });

// app.post("/sendConnectionRequest",userAuth ,  async (req ,res)=>{
//    const user = req.user;
//    // logic -- sending the connection request
//    console.log("sending the connection  request");
//    res.send( user.firstName +  " sent the connection request")
//    //if i want this api to get hit only when the user is logged in 
// });


// finding one user from the database by email
app.get("/user",async (req, res)=>{
   const useremail = req.body.emailId;
   try{
     const User = await UserModel.find({emailId:useremail});
    if(User.length === 0){
      res.status(400).send("user not found")
   }else{
     res.send(User);

   }
     
   }
   catch {
      res.status(400).send("something went wrong")
   }
})

//Making the GET API (feed api --get all the user from the database)
app.get("/feed",async (req ,res)=>{
   try{
      const User = await UserModel.find({});
       if(User.length === 0){
      res.status(400).send("user not found")
   }else{
     res.send(User);
   }
   } catch (err){
      res.status(400).send("something went wrong")
   }

})

//Deleting the user 
app.delete("/user", async (req ,res)=>{
   const userId = req.body.UserId;
   try{
      //const user = await UserModel.findByIdAndDelete({_id : userId}) same both1
      const user = await UserModel.findByIdAndDelete(userId);
      res.send("user deleted succesfully")
   }
   catch (err){
      res.status(400).send("something went wrong")
   }

})

// Updating the data of the  user 
// FIX 1: param name must match exactly -> :userId here and req.params.userId below
app.patch("/user/:userId", async (req, res)=>{
   // const userId = req.body.UserId;
   const userId = req.params.userId;   // FIX 1: no "?." needed, and lowercase u matches the route

   const data = req.body;

  
   try{
       const ALLOWED_UPDATES =[
      // FIX 2: removed "UserId" from here, the id now comes from the URL, not the body
      "about",
     "gender",
     "age",
     "skills"
   ];

   const isUpdateAllowed = Object.keys(data).every((k)=>
   ALLOWED_UPDATES.includes(k));
   if(!isUpdateAllowed){
      // FIX 3: return added, so the code below does not run after sending a response
      return res.status(400).send("update not allowed")
   }
   if(data?.skills.length > 10){
      throw new Error("skills cant be more than 10")
   }
      //read the documentation to understand it 
      // FIX 4: pass the id directly, not { _id : userId }
      await UserModel.findByIdAndUpdate(userId, data,{
         returnDocument : "after",
         runValidators : true,// imp
      });
      res.send("user updated succesfully")
   }catch (err){
      // FIX 5: send a response instead of throwing (throw inside async route = 500 / crash)
      res.status(400).send("UPDATE FAILED: " + err.message)
   }
})
// database related-->
connectDB()
.then(()=>{
    console.log("database connection established");
    app.listen(3000,()=>{
    console.log("we created our server and runs it ")
}) 
})
.catch((err)=>{
    console.log("database cannot established", err.message);
})
 



// const express = require("express");
// const connectDB = require("./config/database");
// const UserModel = require("./models/user");

// const app = express();

// // middleware: JSON body ko parse karke req.body mein daalta hai
// app.use(express.json());

// app.post("/signup", async (req, res) => {
//   console.log(req.body);

  // dynamic data req.body se aa raha hai
//   const user = new UserModel(req.body);

//   try {
//     await user.save();
//     res.send("user added successfully");
//   } catch (err) {
//     res.status(400).send("Error saving the user: " + err.message);
//   }
// });

// // pehle DB connect, phir server listen (top level pe, route ke andar nahi)
// connectDB()
//   .then(() => {
//     console.log("database connection established");
//     app.listen(3000, () => {
//       console.log("server is running on port 3000");
//     });
//   })
//   .catch((err) => {
//     console.log("database cannot be established", err.message);
//   });














































































































































































































































































// const express = require("express");

//  const connectDB = require("./config/database");//imp line 
// const UserModel = require("./models/user");

// const app = express();





// // // app.use((req,res)=>{
// // //     res.send("hello from the server!!!!")
// // // });
// // // app.get("/users",(req,res)=>{
// // //     res.send("hello test this side !!!!")
// // //  });
// // //  app.post("/users",(req,res)=>{
// // //     //saving data to database
// // //     res.send("saved the data !!!!")
// // //  });
// // //  app.delete("/users",(req,res)=>{
// // //     res.send("deleted succesfully !!!!")
// // //  });
// // //  app.use("/test",(req,res)=>{
// // //     res.send("hello test this side !!!!")
// // //  });
// // // app.use("/hello",(req,res)=>{
// // //     res.send("hello this is utkarsh !!!!")
// // // });
// // // app.use("/test/2",(req,res)=>{
// // //     res.send("hello test222222222 this side !!!!")
// // // });

// // // app.use("/make",(req,res)=>{
// // //     res.send("hello make here!!!!")
// // // });

// // // app.use("/",(req,res)=>{
// // //     res.send("hello hello hello!!!!")
// // // });







// // // handling multiple route handlers using single routes 

// // // using the next();

// // // app.use("/users",[(req ,res,next)=>{
// // //    console.log("handler routes 1");
// // //    // res.send("1st response");
// // //    next();
// // // },
// // // (req ,res, next )=>{
// // //    console.log("handler routes 2");
// // //    // res.send("2st response");
// // //    next();
// // // },
// // // (req ,res,next)=>{
// // //    console.log("handler routes 3");
// // //    // res.send("3st response");
// // //    next();
   
// // // },
// // // (req ,res,next)=>{
// // //    console.log("handler routes 4");
// // //     res.send("4st response");
// // // }]);

// // // do array also














// // // validlations 
// // // app.get("/admin/getAllData",(req, res)=>{
// // //    //logic of checking if the request is authorized
// // //    const token = "xyz";
// // //    const isAdminAuthorizes = token === "xyz";
// // //    if(isAdminAuthorizes){
// // //       res.send("all data sent");
// // //    }else{
// // //       res.status(401).send("unauthorized request")
// // //    }
// // // })









// //Error handling 

// // app.get("/getUserData",(req ,res)=>{
// //    //logiv of db  call and get user data 
// //    throw new Error("kfdjsghdfj");
// //    res.send("data sent!!!")
// // });

// // app.use("/",(err,req, res , next)=>{
// //    if(err){
// //       res.status(500).send("something went wrong")
// //    }
// // })


// //creating a first API in the database

// // midlleware
// app.use(express.json());

// app.post("/signup",async (req , res)=>{
   
//    //creating a new instance of the user model
//   const user = new UserModel(req.body);
//      // this is the dummy data 
//       // firstName : "utkarsh",
//       // lastName : "negi",
//       // emailId : "utkarshnegi@41gmail.com",
//       // password : "utkarshnegi@111"

//       // now passing dynamic data into our api
      
   
   
// try{
//    await user.save();
//    res.send("user added succesfully");

// } catch (err){
//    res.status(400).send(err.message);
// }
  
// });


// // finding one user from the database by email
// app.get("/user",async (req, res)=>{
//    const useremail = req.body.emailId;
//    try{
//      const User = await UserModel.find({emailId:useremail});
//     if(User.length === 0){
//       res.status(400).send("user not found")
//    }else{
//      res.send(User);

//    }
     
//    }
//    catch {
//       res.status(400).send("something went wrong")
//    }
// })

// //Making the GET API (feed api --get all the user from the database)
// app.get("/feed",async (req ,res)=>{
//    try{
//       const User = await UserModel.find({});
//        if(User.length === 0){
//       res.status(400).send("user not found")
//    }else{
//      res.send(User);
//    }
//    } catch (err){
//       res.status(400).send("something went wrong")
//    }

// })

// //Deleting the user 
// app.delete("/user", async (req ,res)=>{
//    const userId = req.body.UserId;
//    try{
//       //const user = await UserModel.findByIdAndDelete({_id : userId}) same both1
//       const user = await UserModel.findByIdAndDelete(userId);
//       res.send("user deleted succesfully")
//    }
//    catch (err){
//       res.status(400).send("something went wrong")
//    }

// })

// // Updating the data of the  user 
// app.patch("/user/:UserId", async (req, res)=>{
//    // const userId = req.body.UserId;
//    const userId = req.params?.userId

//    const data = req.body;

  
//    try{
//        const ALLOWED_UPDATES =[
//       "UserId",
//       "about",
//      "gender",
//      "age",
//      "skills"
//    ];

//    const isUpdateAllowed = Object.keys(data).every((k)=>
//    ALLOWED_UPDATES.includes(k));
//    if(!isUpdateAllowed){
//       res.status(400).send("update not allowed")
//    }
//       //read the documentation to understand it 
//       await UserModel.findByIdAndUpdate({_id : userId}, data,{
//          returnDocument : "after",
//          runValidators : true,// imp
//       });
//       res.send("user updated succesfully")
//    }catch (err){
//       throw new Error("updated not allowed")
//    }
// })
// // database related-->
// connectDB()
// .then(()=>{
//     console.log("database connection established");
//     app.listen(3000,()=>{
//     console.log("we created our server and runs it ")
// }) 
// })
// .catch((err)=>{
//     console.log("database cannot established", err.message);
// })
 



// // const express = require("express");
// // const connectDB = require("./config/database");
// // const UserModel = require("./models/user");

// // const app = express();

// // // middleware: JSON body ko parse karke req.body mein daalta hai
// // app.use(express.json());

// // app.post("/signup", async (req, res) => {
// //   console.log(req.body);

//   // dynamic data req.body se aa raha hai
// //   const user = new UserModel(req.body);

// //   try {
// //     await user.save();
// //     res.send("user added successfully");
// //   } catch (err) {
// //     res.status(400).send("Error saving the user: " + err.message);
// //   }
// // });

// // // pehle DB connect, phir server listen (top level pe, route ke andar nahi)
// // connectDB()
// //   .then(() => {
// //     console.log("database connection established");
// //     app.listen(3000, () => {
// //       console.log("server is running on port 3000");
// //     });
// //   })
// //   .catch((err) => {
// //     console.log("database cannot be established", err.message);
// //   });