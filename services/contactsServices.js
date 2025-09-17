import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db", "contacts.json");

async function readContacts() {
  const raw = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(raw);
}

async function writeContacts(list) {
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2), "utf-8");
}

export async function listContacts() {
  return await readContacts();
}

export async function getContactById(contactId) {
  const list = await readContacts();
  return list.find((c) => String(c.id) === String(contactId)) ?? null;
}

export async function addContact(name, email, phone) {
  const list = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  list.push(newContact);
  await writeContacts(list);
  return newContact;
}

export async function removeContact(contactId) {
  const list = await readContacts();
  const idx = list.findIndex((c) => String(c.id) === String(contactId));
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await writeContacts(list);
  return removed;
}

export async function updateContact(contactId, data) {
  const list = await readContacts();
  const idx = list.findIndex((c) => String(c.id) === String(contactId));
  if (idx === -1) return null;

  const updated = { ...list[idx], ...data };
  list[idx] = updated;
  await writeContacts(list);
  return updated;
}
