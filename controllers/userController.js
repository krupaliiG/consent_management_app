const User = require("../models/user.model.js");
const Consent = require("../models/consent.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

exports.RegisterUser = async (request, response) => {
  try {
    const userDetail = request.body;
    const { username, email, password } = userDetail;
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = new User({
      username,
      email,
      password: hashedPassword,
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
    const { email, password } = request.body;
    const dbUser = await User.findOne({ email: email });
    if (!dbUser) {
      response.status(400).send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched) {
        const data = await User.findOne({
          email: email,
          password: dbUser.password,
        });
        if (data) {
          const payload = { id: data._id, email: email };
          const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
          response.status(200).send({ success: true, message: jwtToken });
        } else {
          response
            .status(400)
            .send({ success: false, message: "Invalid Credentials!" });
        }
      } else {
        response.status(400).send("Invalid Password!");
      }
    }
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.ChangePassword = async (request, response) => {
  try {
    const { _id } = request.data;

    const updatedData = request.body;

    const data = await User.findByIdAndUpdate(_id, updatedData);
    response
      .status(200)
      .send({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.Users = async (request, response) => {
  try {
    const {
      id = null,
      username = "",
      email = "",
      page = 0,
      limit = 0,
    } = request.query;

    let filterQuery = [];

    if (id) {
      filterQuery.push({ _id: id });
    }
    if (username) {
      filterQuery.push({ username: username });
    }
    if (email) {
      filterQuery.push({ email: email });
    }

    filterQuery = filterQuery.length ? { $or: filterQuery } : {};

    const data = await User.find(filterQuery)
      .skip(page * limit)
      .limit(limit);

    response.status(200).send({ success: true, data: data });
  } catch (err) {
    response.status(400).send(err.message);
  }
};

exports.UserDetail = async (request, response) => {
  try {
    const { _id } = request.data;
    const { page = 0, limit = 1, name = "" } = request.query;

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
    // .skip(page * limit)
    // .limit(limit);

    response.send(data);
  } catch (err) {
    response.status(401).send(err.message);
  }
};
