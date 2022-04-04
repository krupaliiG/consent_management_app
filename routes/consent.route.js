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
  .get(
    INTERNAL_LINKS.CONSENT.GROUP_CONSENT,
    authentication,
    consent.GroupConsents
  )
  .put(
    INTERNAL_LINKS.CONSENT.UPDATE_CONSENT,
    authentication,
    consent.updateConsent
  )
  .delete(
    INTERNAL_LINKS.CONSENT.DELETE_CONSENT,
    authentication,
    consent.deleteConsent
  )
  .post(INTERNAL_LINKS.CONSENT.FROM_FILE_CONSENT, consent.FromFileData);
