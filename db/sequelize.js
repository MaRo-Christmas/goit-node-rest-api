import { Sequelize } from "sequelize";
import "dotenv/config";

const { DATABASE_URL } = process.env;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
}
