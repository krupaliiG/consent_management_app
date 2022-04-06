import logger from "./logger";

const infoLogger = (error, requestURL) => {
  const infoObj = {
    message: error,
    currentTime: new Date().toLocaleString(),
    requestURL,
  };

  logger.infoLog.info(infoObj);
};

export default infoLogger;
