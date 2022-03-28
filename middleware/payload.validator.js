// const Joi = require("joi");

// module.exports = async (request, response, next) => {
//   try {
//     const schema = Joi.object({
//       name: Joi.number().required(),
//       email: Joi.string().required(),
//       consentFor: Joi.string().required(),
//     });

//     const options = {
//       abortEarly: false,
//       allowUnknown: true,
//       stripUnknown: true,
//     };

//     const { err, value } = schema.validate(request.body, options);
//     console.log(value);
//     if (err) {
//       request.status(400).send({
//         success: false,
//         message: err.message,
//       });
//     } else {
//       request.data = value;
//       next();
//     }
//   } catch (err) {
//     response.status(400).send(err.message);
//   }
// };
