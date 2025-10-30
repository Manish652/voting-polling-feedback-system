import express from "express";
import {createPost,getPosts,addReaction, deletePost} from "../controllers/Post.Controller.js";
import { addComment,getComments, deleteComment } from "../controllers/Comment.Controller.js";
import protect from "../middleware/auth.js";

const PostRouter = express.Router();

// Posts

PostRouter.post("/",protect,createPost);
PostRouter.get("/",getPosts);
PostRouter.delete("/:postId", protect, deletePost);

// reaction

PostRouter.post("/reaction",protect,addReaction);

//comments

PostRouter.post("/comment",protect,addComment);
PostRouter.get("/comment/:postId",protect,getComments);
PostRouter.delete("/comment/:commentId", protect, deleteComment);

export default PostRouter;