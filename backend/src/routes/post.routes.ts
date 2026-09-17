import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { createPost, deletePost, feed, getGlobalPosts, getSinglePost, updatePost } from "../controllers/post.controller.js";
import { upload } from "../config/multer.config.js";

const router = Router();


router.post("/post", protect, upload.single("image") ,createPost);
router.get("/posts", protect, getGlobalPosts);
router.get("/post/:id", protect, getSinglePost);
router.put("/post/:id", protect, updatePost);
router.delete("/post/:id", protect, deletePost);


router.get("/posts/feed", protect, feed);

export default router;