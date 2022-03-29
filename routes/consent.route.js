// const validationSchema = require("../joiSchema/validationSchema");
import validationSchema from "../joiSchema/validationSchema";

module.exports = (app) => {
  const consent = require("../controllers/apiController.js");
  const authentication = require("../middleware/auth.js");

  app.get("/consents", authentication, consent.ListConsents);

  app.post(
    "/give-consent",
    authentication,
    validationSchema.addConsentSchema,
    consent.GiveConsents
  );

  app.put("/:id", authentication, consent.updateConsent);

  app.delete("/:id", authentication, consent.deleteConsent);
};
