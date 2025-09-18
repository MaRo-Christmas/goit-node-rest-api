import Contact from "../models/contact.js";

export async function listContacts() {
  const rows = await Contact.findAll({ order: [["created_at", "DESC"]] });
  return rows.map((r) => r.toJSON());
}

export async function getContactById(id) {
  const row = await Contact.findByPk(id);
  return row ? row.toJSON() : null;
}

export async function addContact(name, email, phone) {
  const row = await Contact.create({ name, email, phone });
  return row.toJSON();
}

export async function removeContact(id) {
  const row = await Contact.findByPk(id);
  if (!row) return null;
  const data = row.toJSON();
  await row.destroy();
  return data;
}

export async function updateContact(id, data) {
  const [count, rows] = await Contact.update(data, {
    where: { id },
    returning: true,
  });
  if (count === 0) return null;
  return rows[0].toJSON();
}
