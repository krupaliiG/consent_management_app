const Joi = require("joi");

import { validateRequest } from "../middleware";

function addConsentSchema(request, response, next) {
  console.log("from schema", request.data);
  const schema = Joi.object({
    name: Joi.string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9.,$;\-/|()\[\]{} ]+$/)
      .required(),
    email: Joi.string()
      .email()
      .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .required(),
    consent_for: Joi.string().required(),
  }).unknown(true);

  validateRequest(request, response, next, schema);
}

function registerUserSchema(request, response, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true);

  validateRequest(request, response, next, schema);
}

function loginUserSchema(request, response, next) {
  const schema = Joi.object({
    email: Joi.string().required().messages({
      "string.base": `Name should be a type of string`,
      "string.empty": `Name must contain value`,
      "string.pattern.base": `Name must be enter in valid format`,
      "any.required": `Name is a required field`,
    }),
    password: Joi.string().required(),
  });

  validateRequest(request, response, next, schema);
}

export default { addConsentSchema, registerUserSchema, loginUserSchema };
