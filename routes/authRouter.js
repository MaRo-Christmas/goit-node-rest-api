import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";
import auth from "../middlewares/auth.js";
import {
  validateBody,
  resendVerifySchema,
} from "../middlewares/validateBody.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, getCurrent);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(resendVerifySchema), resendVerifyEmail);

export default router;
