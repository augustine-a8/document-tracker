import Joi from "joi";

const addNewMailSchema = Joi.object({
  addressee: Joi.string().required(),
  referenceNumber: Joi.string().required(),
});

const dispatchMailSchema = Joi.object({
  mailIds: Joi.array().items(Joi.string().required()).required(),
});

const receiveMailSchema = Joi.object({
  receipient: Joi.string().required(),
  receipientContact: Joi.string().max(10).required(),
  receipientSignatureUrl: Joi.string().required(),
});

const addNewDriverSchema = Joi.object({
  name: Joi.string().required(),
  contact: Joi.string().required(),
});

const findDriverByNameSchema = Joi.object({
  search: Joi.string().required(),
});

export {
  addNewMailSchema,
  dispatchMailSchema,
  receiveMailSchema,
  addNewDriverSchema,
  findDriverByNameSchema,
};
