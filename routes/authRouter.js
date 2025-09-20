import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", auth, getCurrent);
router.post("/logout", auth, logout);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default router;
