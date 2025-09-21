import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../services/email.js";

const { JWT_SECRET, BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) throw HttpError(409, "Email in use");

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const user = await User.create({
      email,
      password: hash,
      verify: false,
      verificationToken,
    });

    const verifyLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Дякуємо за реєстрацію!</p>
        <p>Щоб підтвердити email, перейдіть за посиланням:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
      `,
    });

    res.status(201).json({
      user: { email: user.email, subscription: user.subscription },
      message: "User registered. Verification email sent.",
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

    if (!user.verify) throw HttpError(401, "Email not verified");

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

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    if (!user.verificationToken) {
      user.verificationToken = nanoid();
      await user.save();
    }

    const verifyLink = `${BASE_URL}/api/auth/verify/${user.verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <p>Щоб підтвердити email, перейдіть за посиланням:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
      `,
    });

    return res.json({ message: "Verification email sent" });
  } catch (err) {
    next(err);
  }
};
