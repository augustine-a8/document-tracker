import Joi from "joi";

const readUserNotificationsSchema = Joi.object({
  notifications: Joi.array()
    .items(Joi.string().uuid().required())
    .min(1)
    .required(),
});

export { readUserNotificationsSchema };
