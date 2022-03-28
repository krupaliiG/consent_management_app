const Joi = require("joi");
// import {validateRequest} from '../middleware'
const validateRequest = require("../middleware/validateRequest");

function addConsentSchema(req, res, next) {
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

  //   console.log("schema::", schema);
  validateRequest(req, res, next, schema);
}

module.exports = { addConsentSchema };
