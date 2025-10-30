// models/Setting.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  candidateVoteStart: { type: Date, required: true },   
  candidateVoteEnd: { type: Date, required: true },    
  status: { type: String, enum: ["not-started", "active", "ended"], default: "not-started" },
  isPublished: { type: Boolean, default: false } 
}, { timestamps: true });

const SettingModel = mongoose.model("Setting", settingSchema);

export default SettingModel;
