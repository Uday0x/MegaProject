import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
})


const connectDB = async(req ,res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoDb connected")
    } catch (error) {
        console.log("error connecting to the database",error)
        process.exit(1); //since our project demand is such //we cannot work wouthout our databe //thats y we exit the process
    }   
}


export default connectDB;