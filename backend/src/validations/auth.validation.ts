import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  department: Joi.string().required(),
  role: Joi.string().required(),
});

export { loginSchema, registerSchema };
