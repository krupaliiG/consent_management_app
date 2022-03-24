const User = require("../models/user.model.js");
const Consent = require("../models/consent.model.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

exports.RegisterUser = async (request, response) => {
  try {
    const userDetail = request.body;
    const { username, email, password } = userDetail;

    const data = new User({
      username,
      email,
      password,
    });

    await data.save();
    response
      .status(200)
      .send({ success: true, message: "Registration Successfull!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.LoginUser = async (request, response) => {
  try {
    const { username, password } = request.body;
    const data = await User.findOne({ username: username, password: password });
    if (data) {
      const payload = { id: data._id, username: username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.status(400).send({ success: true, message: jwtToken });
    } else {
      response
        .status(200)
        .send({ success: false, message: "Invalid Credentials!" });
    }
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.ChangePassword = async (request, response) => {
  try {
    console.log(request.data);
    const { _id } = request.data;
    console.log(_id);
    const updatedData = request.body;

    const data = await User.findByIdAndUpdate(_id, updatedData);
    response
      .status(200)
      .send({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.UserDetail = async (request, response) => {
  try {
    const { _id } = request.data;
    console.log(_id);

    const data = await User.aggregate([
      {
        $match: {
          _id: _id,
        },
      },
      {
        $lookup: {
          from: "consents",
          localField: "_id",
          foreignField: "createdBy",
          as: "consentGivenByUser",
        },
      },
    ]);

    response.send(data);
  } catch (err) {
    response.status(401).send(err.message);
  }
};
