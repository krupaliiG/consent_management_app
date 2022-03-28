// import { validationSchema } from "../joiSchema";
const validationSchema = require("../joiSchema/validationSchema");

module.exports = (app) => {
  const consent = require("../controllers/apiController.js");
  const authentication = require("../middleware/auth.js");
  const validator = require("../middleware/payload.validator.js");

  app.get("/consents", authentication, consent.ListConsents);

  app.post(
    "/give-consent",
    authentication,
    validationSchema.addConsentSchema,
    // validator,
    consent.GiveConsents
  );

  app.put("/:id", authentication, consent.updateConsent);

  app.delete("/:id", authentication, consent.deleteConsent);
};
