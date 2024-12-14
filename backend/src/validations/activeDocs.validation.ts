import Joi from "joi";

const addActiveDocSchema = Joi.object({
  subject: Joi.string().required(),
  referenceNumber: Joi.string().required(),
});

const forwardActiveDocSchema = Joi.object({
  forwardToId: Joi.string().uuid().required(),
  comment: Joi.string().required(),
});

const acknowledgeForwardedActiveDocumentSchema = Joi.object({
  transactionAcknowledgements: Joi.array()
    .items(
      Joi.object({
        sentTransactionId: Joi.string().uuid().required(),
        stateHistoryId: Joi.string().uuid().required(),
      })
    )
    .min(1)
    .required(),
});

const returnActiveDocSchema = Joi.object({
  transactionReturned: Joi.object({
    sentTransactionId: Joi.string().uuid().required(),
    stateHistoryId: Joi.string().uuid().required(),
  }),
});

export {
  addActiveDocSchema,
  forwardActiveDocSchema,
  acknowledgeForwardedActiveDocumentSchema,
  returnActiveDocSchema,
};
