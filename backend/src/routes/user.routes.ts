import { Router } from "express";
import { emailVerification, getMe, login, logout, register, resendVerificationToken } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

// Register
router.post("/auth/register", register);
router.post("/auth/emailVerification/:verifyEmail", emailVerification);
router.post("/auth/resendVerificationToken", resendVerificationToken);

// Login
router.post("/auth/login", login);


// Logout
router.get("/auth/logout", protect, logout);

// Get Me
router.get("/auth/getme", protect, getMe);

export default router;