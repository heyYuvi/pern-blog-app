import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { toggleFollow } from "../controllers/follow.controller.js";

const router = Router();

router.put("/user/:id/follow", protect, toggleFollow);

export default router;