'use strict';

require('dotenv').config();

const { db } = require('./src/models/index.model');
const server = require('./src/server');

db.sync().then(() => {
  server.start(process.env.PORT);
});
