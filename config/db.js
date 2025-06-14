import mongoose from "mongoose";


// import React is not needed unless you use JSX or React components
let cached  = global.mongoose || {conn:null, promise:null}
const connectDB = async () => {
   if(cached.conn) return cached.conn;
   if (!cached.promise){
     cached.promise = mongoose.connect(process.env.MONGODB_URL).then((mongoose)=>mongoose)
   }
   try {
     cached.conn = await cached.promise
   } catch (error) {
     console.error("Error connecting to mongoDB:",error)
   }
   return cached.conn
};

export default connectDB;