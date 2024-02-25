const logger = require('morgan');
const dayjs = require('dayjs');

const morganMiddleware = () => {
  logger.token('host', function (req, res) {
    return req.hostname;
  });

  logger.token('date', function () {
    const date = dayjs(new Date()).format('DD/MM/YY');
    return date;
  });

  logger.token('time', function () {
    const time = dayjs(new Date()).format('HH:mm');
    return time;
  });

  return logger(':method url::url date::date time::time host::host status::status res::res[content-length] - :response-time ms');
};

module.exports = morganMiddleware;
