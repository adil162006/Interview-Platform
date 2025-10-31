import express from "express";
import { ENV } from "./lib/env.js";
const app =express();


const port = ENV.PORT || 3000;
app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.listen(port,()=> console.log(`Server is running on port ${port}`));