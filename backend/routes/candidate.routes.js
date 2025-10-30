import express from "express";
import CandidateModel from "../models/CandidateModel.js"
import protect from "../middleware/auth.js";
const candidateRouter = express.Router();

candidateRouter.get("/", protect, async (req, res) => {
  try {
    const candidates = await CandidateModel.find().select(
      "name partyName partySymbol candidateImage"
    );
    res.json(candidates);
    //console.log(candidates);
    
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

candidateRouter.get("/:id", protect, async (req, res) => {
  try {
    const candidate = await CandidateModel.findById(req.params.id).select(
      "name partyName partySymbol candidateImage gender dob"
    );
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error("Get single candidate error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default candidateRouter;
