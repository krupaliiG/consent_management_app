import { userModel } from "../models";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
import { errorLogger } from "../utils";
import generator from "generate-password";
import { userService } from "../mongoServices";
import { transporter } from "../utils";
import { hashPassword } from "../utils";

const RegisterUser = async (request, response) => {
  try {
    const {
      body: { username, email, password },
    } = request;

    const validateEmail = await userService.findOneQuery(email);

    if (validateEmail.length) {
      response
        .status(400)
        .send({ success: false, message: "Email Already exists!" });
    } else {
      const hashedPassword = await hashPassword(password);

      const obj = {
        username,
        email,
        password: hashedPassword,
      };

      const data = await userService.insertOne(obj);

      response
        .status(200)
        .send({ success: true, message: "Registration Successfull!" });
    }
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const randomPasswordRegistration = async (request, response) => {
  try {
    const { username, email } = request.body;
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const hashedPassword = await hashPassword(password);
    const obj = {
      username,
      email,
      password: hashedPassword,
    };

    const data = await userService.insertOne(obj);
    const fromEmail = process.env.fromEmail;

    const mailData = {
      from: fromEmail,
      to: email,
      subject: "Password Authentication",
      text: `Registration successfull! Your password is ${password}. Thank you.`,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) throw new Error();
      response.status(200).send({
        success: true,
        message:
          "Registration successfull! Email sent to you on your registered email Id",
      });
    });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const dbUser = await userModel.findOne({ email: email });

    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
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
        response
          .status(400)
          .send({ success: false, message: "Invalid Password!" });
      }
    }
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const ChangePassword = async (request, response) => {
  try {
    const { _id } = request.currentUser;

    const updatedData = request.body;

    const data = await userModel.findByIdAndUpdate(_id, updatedData);
    response
      .status(200)
      .send({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const Users = async (request, response) => {
  try {
    const data = await userModel.aggregate([
      {
        $lookup: {
          from: "consents",
          localField: "_id",
          foreignField: "createdBy",
          as: "consentGivenByUser",
        },
      },
      {
        $addFields: {
          totalConsents: { $size: { $ifNull: ["$consentGivenByUser", []] } },
        },
      },
    ]);

    const totalCount = await userModel.countDocuments();

    response
      .status(200)
      .send({ success: true, totalUser: totalCount, data: data });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const UserDetail = async (request, response) => {
  try {
    const { _id } = request.currentUser;
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
    response.send({ success: true, message: data });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(401).send({ success: false, message: error.message });
  }
};

export default {
  RegisterUser,
  randomPasswordRegistration,
  LoginUser,
  ChangePassword,
  Users,
  UserDetail,
};
