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
// const app = express();

// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", 
//     "default-src 'self' http://localhost:5173; " +
//     "font-src https://fonts.gstatic.com; " +
//     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//     "script-src 'self' 'unsafe-inline' http://localhost:5173; " +
//     "img-src 'self' data: blob:; " +
//     "connect-src 'self' ws: wss: http://localhost:5173;"
//   );
//   next();
// });


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials :true,
})
);
 
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log(`Server if running on the port ${PORT}`);
    connectDB();
});