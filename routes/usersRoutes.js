import { Router } from "express";
import {
  register,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/register", register);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerifyEmail);

export default router;
