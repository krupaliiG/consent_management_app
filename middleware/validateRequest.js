const validateRequest = (request, response, next, schema) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { err, value } = schema.validate(request.body, options);

    if (err) {
      response.status(400).send({
        success: false,
        message: err,
      });
    } else {
      request.data = value;
      next();
    }
  } catch (err) {
    response.status(400).send(err.message);
  }
};

module.exports = validateRequest;
