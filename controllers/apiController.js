const Consent = require("../models/consent.model.js");

const { ObjectId } = require("mongodb");

exports.ListConsents = async (request, response) => {
  try {
    // const { name, email } = request.query;

    // const data = await Consent.find({});
    console.log("hhhhh");
    const {
      id = null,
      name = "",
      email = "",
      page = 0,
      limit = 0,
    } = request.query;

    let filterQuery = [];

    console.log(id, name, email, page, limit);
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
    console.log(filterQuery);

    // {
    //   $or: [{ _id: id }, { name: name }, { email: email }],
    // }

    const data = await Consent.find(filterQuery)
      .skip(page * limit)
      .limit(limit);

    // console.log(data);

    // const data = await Consent.find()
    // .skip(page * limit)
    // .limit(limit);

    response.status(200).send({ success: true, data: data });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.GiveConsents = async (request, response) => {
  try {
    console.log("in give");
    const { _id } = request.data;

    const consentDetail = request.body;
    const { name, email, consent_for } = consentDetail;

    const data = new Consent({
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
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.updateConsent = async (request, response) => {
  try {
    const { _id } = request.data;

    const id = request.params;
    const updateData = request.body;

    const data = await Consent.findByIdAndUpdate(ObjectId(id), {
      updatedBy: _id,
      ...updateData,
    });

    response
      .status(200)
      .send({ success: true, message: "Consent updated Successfullly!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.deleteConsent = async (request, response) => {
  try {
    const id = request.params;
    const data = await Consent.findByIdAndDelete(ObjectId(id));
    response
      .status(200)
      .send({ success: true, message: "Consent deleted Successfullly!" });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};
