import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

router.post("/logout", auth, logout);
router.get("/current", auth, getCurrent);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default router;
