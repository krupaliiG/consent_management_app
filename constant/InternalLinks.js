export default {
  BASE_API_URL: "/api/v1/",

  USER: {
    BASE_URL: "/api/v1/users",
    SIGNUP: "/signup",
    REGISTER: "/randomPassword",
    LOGIN: "/login",
    CHANGE_PASSWORD: "/change-password",
    USER_DETAIL: "/userdetail",
    USERS: "/",
  },

  CONSENT: {
    BASE_URL: "/api/v1/consent",
    LIST_CONSENT: "/",
    GROUP_CONSENT: "/bydate",
    ADD_CONSENT: "/add",
    UPDATE_CONSENT: "/:id",
    DELETE_CONSENT: "/:id",
    FROM_FILE_CONSENT: "/fromfile",
    GENERATE_CSV: "/generatecsv",
    UPLOAD_IMG: "/uploadimg",
  },
};
