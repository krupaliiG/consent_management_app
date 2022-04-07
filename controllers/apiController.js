import { consentModel } from "../models";
import { response, request } from "express";
import { errorLogger, infoLogger } from "../utils";
import dataGenerator from "dummy-data-generator";
import fs from "fs";
const { parse } = require("csv-parse");

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

const convertIntoJson = (resArray, FromFileData) => {
  let jsonData = [];
  let headers = resArray[0].split(",");

  for (let i = 1; i < resArray.length; i++) {
    let data = resArray[i].split(",");

    if (headers.length === data.length) {
      let obj = {};
      for (let j = 0; j < data.length; j++) {
        const value = FromFileData
          ? data[j].trim()
          : JSON.parse(data[j].trim());

        obj[headers[j].trim()] = value;
      }

      jsonData.push(obj);
    }
  }
  JSON.stringify(jsonData);
  return jsonData;
};

const FromFileData = async (request, response) => {
  try {
    const { originalname } = request.file;
    const validatedData = [];
    const parser = parse({ columns: true }, async (error, records) => {
      for (let record of records) {
        const data = await consentModel.find({ email: record.email });
        if (data.length === 0) {
          validatedData.push(record);
        }
      }

      await consentModel.insertMany(validatedData);
      fs.unlinkSync(`./uploads/${originalname}`);

      response
        .status(200)
        .send({ success: true, data: "Data Added successfully!" });
    });
    fs.createReadStream(`./uploads/${originalname}`).pipe(parser);
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
      count: 1,
      isCSV: true,
    });

    const resArray = randomData.split("\r\n");

    const jsonData = convertIntoJson(resArray);

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

const uploadImage = async (request, response) => {
  try {
    response
      .status(200)
      .send({ success: true, message: "File uploaded successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
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
  uploadImage,
};
