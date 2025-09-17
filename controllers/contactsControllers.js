import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await contactsService.removeContact(id);
    if (!removed) throw HttpError(404, "Not found");
    res.status(200).json(removed);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const created = await contactsService.addContact(name, email, phone);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body || {}).length) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const updated = await contactsService.updateContact(id, req.body);
    if (!updated) throw HttpError(404, "Not found");
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
