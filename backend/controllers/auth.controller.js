import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const signup = async (req,res)=>{
      try {
    const { name, email, dob, gender, phone, vill, po, ps, dist, state, pincode, password } = req.body;

    if (!name || !email || !dob || !gender || !phone || !vill || !po || !ps || !dist || !state || !pincode || !password) {
      return res.status(400).json({ error: "All fields are required" }); }
      

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);
    const avatar = req.file ? req.file.filename : "";

    const newUser = await UserModel.create({
      name,
      email,
      dob,
      gender,
      phone,
      address: { vill, po, ps, dist, state, pincode },
      avatar,
      password
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
};

export const login = async (req,res)=>{
 try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
   // create the token to send to client
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    // Handle validation errors as 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    res.status(500).json({ message: "Server error during login", details: error.message });
  }

};

export const getUsers = async (req,res)=>{
    try {
    res.json(req.user); 
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: err.message });
    }
    res.status(500).json({ message: "Error fetching users", details: err.message });
  }

};
