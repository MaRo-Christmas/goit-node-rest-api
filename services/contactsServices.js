import Contact from "../models/contact.js";

export async function listContacts(ownerId) {
  const rows = await Contact.findAll({
    where: { owner: ownerId },
    order: [["created_at", "DESC"]],
  });
  return rows.map((r) => r.toJSON());
}

export async function getContactById(id, ownerId) {
  const row = await Contact.findOne({ where: { id, owner: ownerId } });
  return row ? row.toJSON() : null;
}

export async function addContact(
  { name, email, phone, favorite = false },
  ownerId
) {
  const row = await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner: ownerId,
  });
  return row.toJSON();
}

export async function updateContact(id, data, ownerId) {
  const [count, rows] = await Contact.update(data, {
    where: { id, owner: ownerId },
    returning: true,
  });
  if (count === 0) return null;
  return rows[0].toJSON();
}

export async function removeContact(id, ownerId) {
  const row = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!row) return null;
  const json = row.toJSON();
  await row.destroy();
  return json;
}

export async function updateStatusContact(id, { favorite }, ownerId) {
  const [count, rows] = await Contact.update(
    { favorite },
    { where: { id, owner: ownerId }, returning: true }
  );
  if (count === 0) return null;
  return rows[0].toJSON();
}
