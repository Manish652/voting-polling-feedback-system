import mongoose from "mongoose";
const connectDB = async ()=>{
    const connectionURL = "mongodb://localhost:27017/votingSystemPro";
    try{
        const connectionInstance = await mongoose.connect(connectionURL);
              console.log(`\n MongoDB connected !!`)
              console.log(`DB is Connected running on ${connectionURL}`);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}
export default connectDB;

