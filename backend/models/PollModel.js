import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  votedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: { type: Date, default: Date.now },
  startAt: {type: Date, required: true},
  endAt: {type: Date, required: true},
  status: { type: String, enum: ["upcoming", "active", "inactive"], default: "upcoming" },
},{timestamps: true});


// Indexes
pollSchema.index({ createdAt: -1 });
pollSchema.index({ startAt: 1, endAt: 1 });

pollSchema.pre("save", function(next) {
  const now = new Date();
  if (now < this.startAt) this.status = "upcoming";
  else if (now >= this.startAt && now <= this.endAt) this.status = "active";
  else this.status = "inactive";
  next();
});


 const PollModel =  mongoose.model("Poll", pollSchema);

export default PollModel
