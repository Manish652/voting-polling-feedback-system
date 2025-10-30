import express from "express";

import { getSettings, updateSettings, getPublicStatus } from "../controllers/adminSettings.controller.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const adminSettingRouter = express.Router();


adminSettingRouter.get("/getSettings", protectAdmin, getSettings);

adminSettingRouter.put("/updateSettings", protectAdmin, updateSettings);
// Public route: no auth required

adminSettingRouter.get("/publicStatus", getPublicStatus);

export default adminSettingRouter;

