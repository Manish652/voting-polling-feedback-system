import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    dob:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        enum: ["male","female","others"],
        required: true
    },
    partyName: {
        type:String,
        required: true,
    },
    partySymbol: {
        type: String,
    },
    candidateImage: {
        type: String
    },
    createdAt: { type: Date, default: Date.now }
});

const CandidateModel = mongoose.model("Candidate",CandidateSchema);

export default CandidateModel;
