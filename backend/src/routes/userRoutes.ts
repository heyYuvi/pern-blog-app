import { Router } from "express";
import { emailVerification, register, resendVerificationToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/emailVerification/:verifyEmail", emailVerification);
router.post("/auth/resendVerificationToken", resendVerificationToken);

export default router;