import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { getFollowers, getFollowing, toggleFollow } from "../controllers/follow.controller.js";

const router = Router();

router.put("/user/:id/follow", protect, toggleFollow);
router.get("/user/:id/following", protect, getFollowing);
router.get("/user/:id/followers", protect, getFollowers);

export default router;