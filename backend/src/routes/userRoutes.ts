import { Router } from "express";
import { emailVerification, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/emailVerification/:verifyEmail", emailVerification);

export default router;