import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
const app =express();


const port = ENV.PORT || 3000;
app.get("/",(req,res)=>{
    res.send("Hello World");
})


const startServer = async() =>{
    try {
        await connectDb();
        app.listen(port,()=> {
            console.log(`Server is running on port ${port}`)
        });
    } catch (error) {
        console.log("error starting the server",error);
        
    }
}

startServer()