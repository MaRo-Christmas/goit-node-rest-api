import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(5).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(2),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().min(5),
}).min(1);
