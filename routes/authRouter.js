import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

router.post("/logout", auth, logout);
router.get("/current", auth, getCurrent);

export default router;
