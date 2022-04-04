import winston from "winston";
// const todayDate = new Date();
const LOGS_PATH = "logs";
const todayDate = new Date().toDateString();

// console.log("from logger file");

const logger = {
  errorLog: winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: `${LOGS_PATH}/${todayDate}_error.log`, //logs/date_error.log
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
