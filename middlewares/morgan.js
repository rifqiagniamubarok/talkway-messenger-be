const logger = require('morgan');

const morganMiddleware = () => {
  logger.token('host', function (req, res) {
    return req.hostname;
  });

  return logger(':method url::url host::host status::status res::res[content-length] - :response-time ms');
};

module.exports = morganMiddleware;
