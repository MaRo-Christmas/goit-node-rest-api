import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw HttpError(401, "Not authorized");
    }

    const user = await User.findByPk(payload.id);
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = {
      id: user.id,
      email: user.email,
      subscription: user.subscription,
    };
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}
