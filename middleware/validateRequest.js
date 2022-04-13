const validateRequest = (request, response, next, schema) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(request.body, options);

    if (error) {
      response.status(400).send({
        success: false,
        message: error,
      });
    } else {
      request.body = value;
      next();
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send({ success: false, message: error.message });
  }
};

export default validateRequest;
