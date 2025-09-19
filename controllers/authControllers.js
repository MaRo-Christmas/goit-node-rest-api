import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) throw HttpError(409, "Email in use");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

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
