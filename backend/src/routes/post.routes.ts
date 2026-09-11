import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { createPost, deletePost, getGlobalPosts, getSinglePost, updatePost } from "../controllers/post.controller.js";

const router = Router();


router.post("/post", protect, createPost);
router.get("/posts", protect, getGlobalPosts);
router.get("/post/:id", protect, getSinglePost);
router.put("/post/:id", protect, updatePost);
router.delete("/post/:id", protect, deletePost);

export default router;