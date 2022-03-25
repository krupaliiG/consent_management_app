const Consent = require("../models/consent.model.js");
const { ObjectId } = require("mongodb");

exports.ListConsents = async (request, response) => {
  try {
    const data = await Consent.find({});
    response.status(200).send({ success: true, data: data });
  } catch (err) {
    response.status(400).send({ success: false, message: err.message });
  }
};

exports.GiveConsents = async (request, response) => {
  try {
    const { _id } = request.data;
    console.log(_id);
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
