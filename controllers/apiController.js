import { consentModel } from "../models";
import { response, request } from "express";
import { errorLogger, infoLogger } from "../utils";

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
    console.log("from giveconsent api", request.body);
    const consentDetail = request.body;
    infoLogger(request.query, request.originalUrl);
    const { name, email, consent_for } = consentDetail;

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
  } catch (error) {
    // console.log(request.data);
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

export default {
  ListConsents,
  GroupConsents,
  GiveConsents,
  updateConsent,
  deleteConsent,
};
