const joi = require("joi");

module.exports = async (request, response, next) => {
  try {
    // const { username, email } = request.data;
    // const payload = { username, email };

    const validation = (request, response) =>
      joi.object({
        name: joi.string().alphanum().required(),
        email: joi.string().email().required(),
        consentFor: joi.string().alphanum().required(),
      });

    const { error } = validation.validate(request.data);

    // const data = validation.validate(payload);
    console.log(data);
    next();
  } catch (err) {
    response.status(400).send(err.message);
  }
};
