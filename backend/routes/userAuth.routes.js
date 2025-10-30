import express from "express";
import {signup,login,getUsers} from "../controllers/auth.controller.js";
import upload from "../middleware/multer.js";
import protect from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/signup",upload.single("image"),signup);
authRouter.post("/login",login);
authRouter.get("/users",protect,getUsers);

export default authRouter;