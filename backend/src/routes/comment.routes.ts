import { Router } from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/comments/:id", protect, getComments);
router.post("/comment/:id", protect, addComment);
router.delete("/post/:postId/comment/:commentId", protect, deleteComment);

export default router; 