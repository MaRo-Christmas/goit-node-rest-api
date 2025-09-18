import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const router = Router();

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", validateBody(createContactSchema), createContact);
router.put("/:id", validateBody(updateContactSchema), updateContact);
router.patch(
  "/:contactId/favorite",
  validateBody(updateFavoriteSchema),
  updateFavorite
);
router.delete("/:id", deleteContact);

export default router;
