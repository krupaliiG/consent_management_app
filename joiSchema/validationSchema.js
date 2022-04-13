const Joi = require("joi");

import { validateRequest } from "../middleware";

function addConsentSchema(request, response, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
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
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  validateRequest(request, response, next, schema);
}

export default { addConsentSchema, registerUserSchema, loginUserSchema };
