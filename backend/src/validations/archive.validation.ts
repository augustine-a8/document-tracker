import Joi from "joi";

const addToArchiveSchema = Joi.object({
  itemNumber: Joi.string().required(),
  description: Joi.string(),
  remarks: Joi.string(),
  coveringDate: Joi.string().required(),
  fileNumber: Joi.string().required(),
});

const requestForArchiveDocumentSchema = Joi.object({
  department: Joi.string().required(),
});

const approveRequestForArchiveDocumentSchema = Joi.object({
  transactionIds: Joi.array()
    .items(Joi.string().uuid().required())
    .min(1)
    .required(),
});

const fulfillRequestForArchiveDocumentSchema = Joi.object({
  transactionIds: Joi.array()
    .items(Joi.string().uuid().required())
    .min(1)
    .required(),
});

const returnArchiveDocumentSchema = Joi.object({
  remarks: Joi.string(),
});

export {
  addToArchiveSchema,
  requestForArchiveDocumentSchema,
  approveRequestForArchiveDocumentSchema,
  fulfillRequestForArchiveDocumentSchema,
  returnArchiveDocumentSchema,
};
