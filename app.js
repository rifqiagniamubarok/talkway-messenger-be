const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

// routing
const routes = require('./routes');
app.use('/', routes);

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3560;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
