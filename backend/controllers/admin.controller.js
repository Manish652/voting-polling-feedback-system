import AdminModel from "../models/AdminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CandidateModel from "../models/CandidateModel.js"

dotenv.config();
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || "your_admin_jwt_secret";


// ----- adminLogin --------


export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET_ADMIN, { expiresIn: "8h" });

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ADD CANDIDATE --------------------

export const addCandidate = async (req, res) => {
  try {
    const { name, email, dob, gender, partyName } = req.body;

    if (!name || !email || !dob || !gender || !partyName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await CandidateModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Candidate already exists" });

    const partySymbol = req.files?.partySymbol?.[0]?.filename || "";
    const candidateImage = req.files?.candidateImage?.[0]?.filename || "";

    const candidate = await CandidateModel.create({
      name,
      email,
      dob,
      gender,
      partyName,
      partySymbol,
      candidateImage
    });

    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    console.error("Add candidate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// routes not use it .. it just funny so i not cut it : )

export const getCandidates = async (req, res) => {
  try {
    const candidates = await CandidateModel.find();
    res.json(candidates);
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add function to get single candidate by ID
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await CandidateModel.findById(id);
    
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error("Get candidate by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCandidate = async (req,res)=>{
  try{
    const { id } = req.params;

    if(req.files){
      if(req.files.partySymbol) req.body.partySymbol = req.files.partySymbol[0].filename;
      if(req.files.candidateImage) req.body.candidateImage= req.files.candidateImage[0].filename;
    }
    const updatedCandidate = await CandidateModel.findByIdAndUpdate(id,req.body,{new:true});
    if(!updatedCandidate){
      return res.status(404).json({
        message:"Candidate not found" 
      });
    }
    // Send response back to client
    res.json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate
    });

  }catch(error){
     console.error("Update candidate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteCandidate = async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedCandidate = await CandidateModel.findByIdAndDelete(id);
    if(!deletedCandidate) return res.status(404).json({
       message: "Candidate not found" 
    })
    res.json({
      message: "candidate delete succesfully"
    })

  }catch(error){
    console.error("Delete candidate error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
