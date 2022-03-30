import { userModel } from "../models";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const RegisterUser = async (request, response) => {
  try {
    const userDetail = request.body;
    const { username, email, password } = userDetail;
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = new userModel({
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

const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const dbUser = await userModel.findOne({ email: email });
    if (!dbUser) {
      response.status(400).send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched) {
        const data = await userModel.findOne({
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

const ChangePassword = async (request, response) => {
  try {
    const { _id } = request.data;

    const updatedData = request.body;

    const data = await userModel.findByIdAndUpdate(_id, updatedData);
    response
      .status(200)
      .send({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

const Users = async (request, response) => {
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

    const data = await userModel
      .find(filterQuery)
      .skip(page * limit)
      .limit(limit);

    response.status(200).send({ success: true, data: data });
  } catch (err) {
    response.status(400).send(err.message);
  }
};

const UserDetail = async (request, response) => {
  try {
    const { _id } = request.data;
    const { page = 0, limit = 1, name = "" } = request.query;

    const data = await userModel.aggregate([
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

export default {
  RegisterUser,
  LoginUser,
  ChangePassword,
  Users,
  UserDetail,
};
