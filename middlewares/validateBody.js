import Joi from "joi";

export const resendVerifySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
    "string.empty": "missing required field email",
  }),
});

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
