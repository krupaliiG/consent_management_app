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
      request.body = value;
      next();
    }
  } catch (err) {
    response.status(400).send(err.message);
  }
};

export default validateRequest;
