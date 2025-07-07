import jwt from "jsonwebtoken";

export const generateToken = (userId , res) => {
   const token = jwt.sign({userId} , process.env.JWT_SECRET,{
    expiresIn : "7d",
   });

  res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  httpOnly: true,                 // Prevents JS access (protects from XSS)
  sameSite: "strict",            // Prevents CSRF (cross-site request forgery)
  secure: process.env.NODE_ENV !== "development", // Only use HTTPS in production
  });
  
  return token;
};




