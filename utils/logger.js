import winston from "winston";

const LOGS_PATH = "logs";
const todayDate = new Date().toDateString();

const logger = {
  errorLog: winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: `${LOGS_PATH}/${todayDate}_error.log`,
      }),
    ],
  }),

  infoLog: winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: `${LOGS_PATH}/${todayDate}_info.log`,
      }),
    ],
  }),
};

export default logger;
