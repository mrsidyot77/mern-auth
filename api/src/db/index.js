import mongoose from "mongoose";
import { dbname } from "../constants.js";

const conectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`) 
        console.log(`\n⚙ MongoDB connected successfully. \nDB HOST: ${connectionInstance.connection.host} `);
        
    } catch (error) {
        console.log("Database Connection failed ", error);
        
    }
}

export default conectDB