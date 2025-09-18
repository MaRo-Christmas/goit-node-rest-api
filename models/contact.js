// models/contact.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

const Contact = sequelize.define(
  "contact",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "contacts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Contact;
