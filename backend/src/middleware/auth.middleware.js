import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if(!token)return res.status(400).json({message : "Unauthorized - No token Provided"});

        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        if(!decoded)return res.status(400).json({message : "Unauthorized : Invalid Token"});

        const user = await User.findById(decoded.userId).select("-password");

        if(!user)return res.status(404).json({message : "User not found"});

        req.user = user;
        // console.log(user);
        
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware" , error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}