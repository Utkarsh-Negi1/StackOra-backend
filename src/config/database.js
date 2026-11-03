const mongoose = require("mongoose")

const connectDB = async ()=>{
  await mongoose.connect("mongodb+srv://negiutkarsh41_db_user:jLuNk4RYOHGXot1o@cluster0.ziysrda.mongodb.net/StackOra")
};

module.exports = connectDB;



