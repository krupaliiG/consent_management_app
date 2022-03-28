const validateRequest = (request, response, next, schema) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    // console.log(request.body);
    const { err, value } = schema.validate(request.body, options);
    console.log("value", err, value);
    if (err) {
      console.log("err", err);
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

// export default validateRequest;

module.exports = validateRequest;
