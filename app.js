require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('./middlewares/morgan');
const helmet = require('helmet');
const { sequelize } = require('./models');
const cors = require('cors');
const server = http.createServer(app);

// middleware
app.use(morgan());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Socket
const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

const socketMessageController = require('./controllers/message/socket');

io.on('connection', (socket) => {
  socket.on('join_session', (data) => {
    socket.join(data);
  });
  socket.on('send_message', (data) => {
    socketMessageController.processMessage(socket, data);
  });
});

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
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
