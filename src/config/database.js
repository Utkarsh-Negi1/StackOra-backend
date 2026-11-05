// const mongoose = require("mongoose")

// const connectDB = async ()=>{
//   await mongoose.connect("mongodb+srv://negiutkarsh41_db_user:jLuNk4RYOHGXot1o@cluster0.ziysrda.mongodb.net/StackOra")
// };

// module.exports = connectDB;

// these are the steps to protect mongodb password


require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error.message);
    }
};

module.exports = connectDB;



