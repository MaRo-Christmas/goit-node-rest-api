import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import usersRouter from "./routes/usersRoutes.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { initDB } from "./db/sequelize.js";
import { verifySmtp } from "./services/email.js";
import auth from "./middlewares/auth.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);
app.use("/api/contacts", auth, contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

(async () => {
  await initDB();
  await verifySmtp();
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
})();
