import { generateToken } from "../lib/utlis.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res) => {
   const {fullName,email,password} = req.body;
   console.log(fullName);

   try {
    
    if(!fullName || !email || !password)return res.status(400).json({message : "All fields are required"});

    if(password.length < 6){
        return res.status(400).json({message : "Password must be atleast 6 character"});
    }

    const user = await User.findOne({email});
    if(user)return res.status(400).json({message : "Email alreasy exits"});
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
        fullName : fullName,
        email : email,
        password : hashedPassword
    });

    if(newUser){
        //valid user know we have to make the JWT token for this User;

        //we use the id here before the save() because the mongoose attach the _id when we instalize it .
        generateToken(newUser._id , res);
        await newUser.save();

        res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            email : newUser.email,
            profilePic : newUser.profilePic,
        });
    }else{
        return res.status(400).json({message : "Invalid User Data"});
        
    }

   } catch (error) {
       console.log("Error in signUp controller" , error.message);
       return res.status(500).json({message : "Interval Server Error"});
   }
};

export const login = async (req,res) => {
   const {email,password} = req.body;

   try {
     const user = await User.findOne({email});

     if(!user)res.status(400).json({message : "Invalid Credentials"});
     
     const isPasswordCorrect = await bcrypt.compare(password , user.password);

     if(!isPasswordCorrect)res.status(400).json({message : "Invalid Credentials"});

     generateToken(user._id,res);

     res.status(200).json({
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profilePic : user.profilePic
     })

   } catch (error) {
      console.log("error in login controller" , error.message);
      res.status(500).json({meassge : "Internal Server Error"});
   }
}

export const logout = (req,res) => {
   try {
    res.cookie("jwt","",{maxAge : 0});
    res.status(200).json({message : "Logout Succesfully"});
   } catch (error) {
      console.log("error in logout controller" , error.message);
      res.status(500).json({meassge : "Internal Server Error"});
   }
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        // console.log(profilePic);
        
        const userId = req.user._id;

        if(!profilePic)res.status(400).json({message : "Profile Pic is required"});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic : uploadResponse.secure_url} , {new : true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile" , error);
        res.status(500).json({message : "Internal Server Error"});
        
    }
}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkauth" , error);
        res.status(500).json({message : "Internal Server Error"});
    }
}
