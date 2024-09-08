
import conectDB from "./db/index.js"
import app from "./app.js";
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") });


conectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`⚙ Server is running on the port ${process.env.PORT} `);
   
    
    app.on("error",(error)=>{
        console.log("ERROR: db not able to listen express", error);
    })
})
})
.catch((error)=>{
    console.log("MongoDB connection failed.",error);
    process.exit(1)
    
})