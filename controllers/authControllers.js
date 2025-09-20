import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;
const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) throw HttpError(409, "Email in use");

    const hash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, {
      s: "250",
      d: "mp",
      protocol: "https",
    });

    const user = await User.create({ email, password: hash, avatarURL });

    res.status(201).json({
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    await user.update({ token });

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw HttpError(401, "Not authorized");

    await user.update({ token: null });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw HttpError(401, "Not authorized");

    res.json({ email: user.email, subscription: user.subscription });
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    const fileName = `${req.user.id}_${Date.now()}${ext}`;
    const destPath = path.join(avatarsDir, fileName);

    await fs.rename(tempPath, destPath);

    const avatarURL = `/avatars/${fileName}`;
    await User.update({ avatarURL }, { where: { id: req.user.id } });

    res.status(200).json({ avatarURL });
  } catch (err) {
    try {
      if (req.file?.path) await fs.unlink(req.file.path);
    } catch {}
    next(err);
  }
};
