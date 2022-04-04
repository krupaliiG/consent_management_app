import { INTERNAL_LINKS } from "../constant";
import { userRoute, consentRoute } from "./index.js";

export default (app) => {
  app.use(INTERNAL_LINKS.USER.BASE_URL, userRoute);
  app.use(INTERNAL_LINKS.CONSENT.BASE_URL, consentRoute);
};
