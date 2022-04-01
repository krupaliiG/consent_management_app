import logger from "./logger";

const errorLogger = (error, requestURL) => {
  console.log(requestURL);
  const errorObj = {
    message: error,
    currentTime: new Date().toLocaleString(),
    requestURL,
  };
  console.log(requestURL);
  logger.errorLog.error(errorObj);
};

export default errorLogger;
