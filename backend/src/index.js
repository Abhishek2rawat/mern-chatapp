import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js"; 
import cookieParser from "cookie-parser"; 
import cors from "cors";

import path from "path";
import {app , server} from "./lib/socket.js";

dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
}));

 
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  // });
  app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

  app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
  
  app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

  app.get("/setting", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log(`Server if running on the port ${PORT}`);
    connectDB();
});