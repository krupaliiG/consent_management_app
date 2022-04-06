import logger from "./logger";

const errorLogger = (error, requestURL) => {
  const errorObj = {
    message: error,
    currentTime: new Date().toLocaleString(),
    requestURL,
  };

  logger.errorLog.error(errorObj);
};

export default errorLogger;
