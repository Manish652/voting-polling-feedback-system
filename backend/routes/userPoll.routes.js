import express from "express"
import { getUserPolls, voteUserPoll, getPublicPolls } from "../controllers/userPoll.controller.js";
import protect from "../middleware/auth.js";

const UserPollRouter = express.Router();


UserPollRouter.get("/getpollsforuser",protect,getUserPolls);
UserPollRouter.get("/public", getPublicPolls);
UserPollRouter.post("/:pollId/vote",protect,voteUserPoll);

export default UserPollRouter;