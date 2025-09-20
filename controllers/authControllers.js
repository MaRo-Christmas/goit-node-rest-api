import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.js";

function HttpError(status, message = "Error") {
  const err = new Error(message);
  err.status = status;
  return err;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "..", "public", "avatars");

const { JWT_SECRET = "dev_secret" } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) throw HttpError(409, "Email in use");

    const hash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, {
      s: "250",
      d: "mp",
      protocol: "https",
    });

    const user = await User.create({
      email,
      password: hash,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk) throw HttpError(401, "Email or password is wrong");

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw HttpError(401, "Not authorized");

    res.json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw HttpError(401, "Not authorized");

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.user?.id) throw HttpError(401, "Not authorized");
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const user = await User.findByPk(req.user.id);
    if (!user) throw HttpError(401, "Not authorized");

    const ext = path.extname(req.file.originalname) || ".jpg";
    const uniqueName = `${user.id}_${Date.now()}${ext}`;
    const destPath = path.join(avatarsDir, uniqueName);

    await fs.rename(req.file.path, destPath);

    const avatarURL = `/avatars/${uniqueName}`;
    user.avatarURL = avatarURL;
    await user.save();

    res.status(200).json({ avatarURL });
  } catch (err) {
    if (req?.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }
    next(err);
  }
};
