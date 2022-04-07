import { userModel } from "../models";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
import { errorLogger } from "../utils";
import { response } from "express";
import generator from "generate-password";
// const Email = require("email-templates");
const nodemailer = require("nodemailer");

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    await data.save();

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: "krupali.igenerate@gmail.com",
        pass: "Krupali@1289",
      },
      secure: true,
    });

    const mailData = {
      from: "krupali.igenerate@gmail.com",
      to: "krupali.igenerate@gmail.com",
      subject: "Password Authentication",
      text: `Registration successfull! Your password is ${password}. Thank you.`,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        response
          .status(400)
          .send({ success: false, message: error.message || message });
      }
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
    const { _id } = request.data;

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
