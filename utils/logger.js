import winston from "winston";
// const todayDate = new Date();
const LOGS_PATH = "logs";

console.log("from logger file");

const logger = {
  errorLog: winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: `${LOGS_PATH}/01_04_2022_error.log`, //logs/date_error.log
      }),
    ],
  }),
};

export default logger;
