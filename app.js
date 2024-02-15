const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');

// Morgan
morgan.token('host', function (req, res) {
  return req.hostname;
});
morgan.token('param', function (req, res, param) {
  return req.params[param] || '-';
});
app.use(morgan(':method host::host status::status param::param[id] res::res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

// routing
const routes = require('./routes');
app.use('/', routes);

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3560;

app.listen(port, () => {
  console.log('\x1b[36m', `Server is running on port ${port}`, '\x1b[0m');
});
