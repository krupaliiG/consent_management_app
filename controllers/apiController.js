import { consentModel } from "../models";
import { response, request } from "express";
import { errorLogger, infoLogger } from "../utils";
import { emit } from "nodemon";
import dataGenerator from "dummy-data-generator";
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const { ObjectId } = require("mongodb");

const ListConsents = async (request, response) => {
  try {
    infoLogger(request.query, request.originalUrl);
    const {
      id = null,
      name = "",
      email = "",
      page = 0,
      limit = 0,
    } = request.query;

    let filterQuery = [];

    if (id) {
      filterQuery.push({ _id: id });
    }
    if (name) {
      filterQuery.push({ name: name });
    }
    if (email) {
      filterQuery.push({ email: email });
    }

    filterQuery = filterQuery.length ? { $or: filterQuery } : {};

    const data = await consentModel
      .find(filterQuery)
      .skip(page * limit)
      .limit(limit);

    response.status(200).send({ success: true, data: data });
  } catch (error) {
    errorLogger(error.message || ererrorr, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const GiveConsents = async (request, response) => {
  try {
    infoLogger(request.body, request.originalUrl);
    const { _id } = request.data;

    const consentDetail = request.body;
    infoLogger(request.query, request.originalUrl);
    const { name, email, consent_for } = consentDetail;

    const validateEmail = await consentModel.find({ email: email });
    console.log(validateEmail);

    if (validateEmail.length !== 0) {
      response
        .status(200)
        .send({ success: true, message: "Email Already exists!" });
    } else {
      const data = new consentModel({
        name,
        email,
        consentFor: consent_for,
        createdBy: _id,
        updatedBy: _id,
      });

      await data.save();

      response
        .status(200)
        .send({ success: true, message: "Consent added Successfullly!" });
    }
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const GroupConsents = async (request, response) => {
  try {
    const data = await consentModel.aggregate([
      {
        $project: {
          date: {
            $dayOfMonth: "$createdAt",
          },
          name: 1,
          consentFor: 1,
        },
      },
      {
        $unwind: "$date",
      },
      {
        $group: {
          _id: "$date",
          consents: {
            $push: {
              name: "$name",
              email: "$email",
              consentFor: "$consentFor",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          Date: "$_id",
          consents: "$consents",
        },
      },
    ]);

    response.send({ success: true, message: data });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const updateConsent = async (request, response) => {
  try {
    const { _id } = request.data;

    const id = request.params;
    const updateData = request.body;

    infoLogger(request.body, request.originalUrl);

    const data = await consentModel.findByIdAndUpdate(ObjectId(id), {
      updatedBy: _id,
      consentFor: updateData.consent_for,
    });

    response
      .status(200)
      .send({ success: true, message: "Consent updated Successfullly!" });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteConsent = async (request, response) => {
  try {
    const id = request.params;
    const data = await consentModel.findByIdAndDelete(ObjectId(id));
    response
      .status(200)
      .send({ success: true, message: "Consent deleted Successfullly!" });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const FromFileData = async (request, response) => {
  try {
    const { filedata } = request.files;
    const { data, name } = filedata;
    const result = await data.toString();
    const resArray = result.split("\n");
    const count = resArray.length - 1;

    let jsonObj = [];
    let headers = resArray[0].split(",");

    for (let i = 1; i < resArray.length; i++) {
      let data = resArray[i].split(",");
      // console.log(data);
      if (headers.length === data.length) {
        let obj = {};
        for (let j = 0; j < data.length; j++) {
          obj[headers[j].trim()] = data[j].trim();
        }
        jsonObj.push(obj);
      }
    }
    JSON.stringify(jsonObj);
    const validatedData = [];
    for (let record of jsonObj) {
      // console.log(record.email);
      const data = await consentModel.find({ email: record.email });
      console.log(data);
      if (data.length === 0) {
        validatedData.push(record);
      }
    }
    console.log(validatedData);
    await consentModel.insertMany(validatedData);

    // for (let i = 1; i <= count - 1; i++) {
    //   const data = resArray[i].split(",");
    //   if (data !== undefined) {
    //     const name = data[0];
    //     const email = data[1];
    //     const consentFor = data[2];
    //     // console.log(name, email);
    //     const object = new consentModel({
    //       name,
    //       email,
    //       consentFor,
    //     });

    //     await object.save();
    //   }
    // }

    response
      .status(200)
      .send({ success: true, data: "Data Added successfully!" });
  } catch (error) {
    response.send({ success: false, message: error.message });
  }
};

const generateCSV = async (request, response) => {
  try {
    const columnData = {
      name: {
        type: "word",
        length: 10,
      },
      email: {
        type: "email",
        length: 20,
      },
      consentFor: {
        type: "paragraph",
        length: 10,
      },
    };

    const randomData = dataGenerator({
      columnData,
      count: 5,
      isCSV: true,
    });

    console.log(randomData);
    const res = randomData.split("\r\n");
    const headers = res[0].split(",");
    console.log(headers);
    console.log(res);

    const jsonData = [];
    JSON.stringify(res);
    console.log(res);
    for (let i = 1; i < res.length; i++) {
      let data = res[i].split(",");

      console.log("data::", data);
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = JSON.parse(data[j]);
      }
      console.log("obj:::", obj);
      jsonData.push(obj);
    }

    JSON.stringify(jsonData);
    console.log(jsonData);
    await consentModel.insertMany(jsonData);

    response
      .status(200)
      .send({ success: true, message: "Data added successfully!" });
  } catch (error) {
    response
      .status(400)
      .send({ success: true, message: error.message || message });
  }
};

export default {
  ListConsents,
  GroupConsents,
  GiveConsents,
  updateConsent,
  deleteConsent,
  FromFileData,
  generateCSV,
};
