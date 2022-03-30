import express from "express";
import { authentication } from "../middleware";
import consent from "../controllers/apiController";
import { validationSchema } from "../joiSchema";
import { INTERNAL_LINKS } from "../constant";

export default express
  .Router()
  .get(
    INTERNAL_LINKS.CONSENT.LIST_CONSENT,
    authentication,
    consent.ListConsents
  )
  .post(
    INTERNAL_LINKS.CONSENT.ADD_CONSENT,
    authentication,
    validationSchema.addConsentSchema,
    consent.GiveConsents
  )
  .put("/:id", authentication, consent.updateConsent)
  .delete("/:id", authentication, consent.deleteConsent);
