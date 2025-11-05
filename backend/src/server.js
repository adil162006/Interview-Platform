import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import path from "path";
import cors from "cors";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
const app =express();


const __dirname = path.resolve();
// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to req object : req.auth()




app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);

const port = ENV.PORT || 3000;
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/video-calls", protectRoute, (req, res) => {
    console.log(req.user._id);
    
    res.send("Video call route - protected");
})


if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


const startServer = async() =>{
    try {
        await connectDB();
        app.listen(port,()=> {
            console.log(`Server is running on port ${port}`)
        });
    } catch (error) {
        console.log("error starting the server",error);
        
    }
}

startServer()