import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { error } from "node:console";

// Controllers for user registration 
export const registerUser = async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;

        // find user by email 
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists!"});
        }

        // Encrypt the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        // Setting user data in session 
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        return res.json({
            message: "Account created successfully!",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    }catch(err: any){
        console.log(err);
        res.status(500).json(err.message);
    }
}

// Controllers for user login 
export const loginUser = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password!"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid email or password!"});
        }

        // Setting the user data in session 
        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        return res.json({
            message: "Login successful!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

// Controllers for user logout 
export const logoutUser = async (req: Request, res: Response) => {
    req.session.destroy((error: any) => {
        if(error){
            console.log(error);
            return res.status(500).json({message: error.message});
        }
    })

    return res.json({message: "Logout successful!"});
}

// Controllers for user verification 
export const verifyUser = async (req: Request, res: Response) => {
    try{ 
        const { userId } = req.session;

        const user = await User.findById(userId).select("-password");
        console.log(user);
        if(!user){
            return res.status(400).json({message: "Invalid user!"});
        }

        return res.json({ user });
    }catch(err: any){
        console.log(error);
        res.status(500).json({message: err.message});
    }
}