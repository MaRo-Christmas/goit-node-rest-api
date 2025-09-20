import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const items = await contactsService.listContacts(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await contactsService.getContactById(id, req.user.id);
    if (!item) throw HttpError(404, "Not found");
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const created = await contactsService.addContact(
      { name, email, phone, favorite },
      req.user.id
    );
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await contactsService.updateContact(
      id,
      req.body,
      req.user.id
    );
    if (!updated) throw HttpError(404, "Not found");
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await contactsService.removeContact(id, req.user.id);
    if (!removed) throw HttpError(404, "Not found");
    res.status(200).json(removed);
  } catch (err) {
    next(err);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updated = await contactsService.updateStatusContact(
      contactId,
      req.body,
      req.user.id
    );
    if (!updated) throw HttpError(404, "Not found");
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
