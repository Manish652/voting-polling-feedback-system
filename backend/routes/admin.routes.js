import express from "express"
import upload from "../middleware/multer.js"
import { protectAdmin } from "../middleware/adminAuth.js"
import { addCandidate, AdminLogin, getCandidates, getCandidateById, deleteCandidate,updateCandidate } from "../controllers/admin.controller.js";
const adminRouter = express.Router();

adminRouter.post("/login",AdminLogin);
adminRouter.post("/addCandidate",
    upload.fields([
       {name: "partySymbol",maxCount:1},
       {name: "candidateImage",maxCount:1}
    ]),addCandidate
);

adminRouter.get("/getCandidate",protectAdmin,getCandidates);
adminRouter.get("/getCandidate/:id",protectAdmin,getCandidateById);
adminRouter.put("/updateCandidate/:id",
  protectAdmin,
  upload.fields([
    { name: "partySymbol", maxCount: 1 },
    { name: "candidateImage", maxCount: 1 }
  ]),
  updateCandidate
);
adminRouter.delete("/deleteCandidate/:id",protectAdmin,deleteCandidate);
export default adminRouter;

