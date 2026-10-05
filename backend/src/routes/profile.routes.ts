import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.config.js";

const router = Router();

router.get("/profile/:id", getProfile);
router.put("/profile", protect, upload.single("image"), updateProfile);

export default router;