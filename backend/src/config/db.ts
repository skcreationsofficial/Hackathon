import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {

 const uri = process.env.MONGO_URI;
 console.log("MONGO_URI:", uri);

 if (!uri) {
   throw new Error("MONGO_URI is not defined in .env");
 }

 try {
   const conn = await mongoose.connect(uri);
   console.log(`MongoDB connected: ${conn.connection.host}`);
 } catch (error) {
   console.error("Error connecting to MongoDB:", error);
   process.exit(1);
 }

};

export default connectDB;