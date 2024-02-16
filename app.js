const express = require('express');
const path = require('path');
const app = express();
const morgan = require('./middlewares/morgan');
const helmet = require('helmet');
const { sequelize } = require('./models');

// middleware
app.use(morgan());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Test db connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// routing
const routes = require('./routes');
app.use('/', routes);

const port = process.env.PORT || 3560;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
