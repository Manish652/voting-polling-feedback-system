import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./configs/ConnectDB.js";
import authRouter from "./routes/userAuth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import voteRouter from "./routes/vote.route.js";
import adminPollRouter from "./routes/admin.poll.route.js";
import UserPollRouter from "./routes/userPoll.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import adminFeedbackRouter from "./routes/admin.feedback.routes.js";
import adminSettingRouter from "./routes/adminSetting.routes.js";
import PostRouter from "./routes/Post.routes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true              
}));
app.use(express.json());
app.use("/upload",express.static(path.join(process.cwd(),"uploads")));

connectDB();

app.use("/api",authRouter);
app.use("/api/admin",adminRouter);
app.use("/api/candidate",candidateRouter);
app.use("/api/vote",voteRouter);
app.use("/api/admin/poll",adminPollRouter);
app.use("/api/users/poll",UserPollRouter);
app.use("/api/feedback",feedbackRouter);
app.use("/api/admin/feedback",adminFeedbackRouter);
app.use("/api/admin/settings",adminSettingRouter);

app.use("/api/post",PostRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
});
