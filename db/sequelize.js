import { Sequelize } from "sequelize";
import "dotenv/config";

const { DATABASE_URL } = process.env;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

async function ensureUserColumns() {
  await sequelize.query(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "verify" BOOLEAN NOT NULL DEFAULT false;
  `);
  await sequelize.query(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "verificationToken" VARCHAR(255);
  `);
}

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    await ensureUserColumns();
    console.log("Users table is up-to-date (verify, verificationToken)");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
}
