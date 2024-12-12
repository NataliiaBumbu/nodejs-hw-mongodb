import Joi from 'joi';

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().required(),
  contactType: Joi.string().required(), 
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string(),
  contactType: Joi.string(), 
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
}).min(1);

export { createContactSchema, updateContactSchema };
