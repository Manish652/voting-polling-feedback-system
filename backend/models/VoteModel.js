import mongoose from "mongoose";
const VoteSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true
    },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    votedAt: { type: Date, default: Date.now }
});

const VoteModel = mongoose.model("vote",VoteSchema);
export default VoteModel;