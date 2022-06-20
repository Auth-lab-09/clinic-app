'use strict';

const express = require('express');

const notFound = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');

const authRouter = require('./routes/signin-up.route');
const patientRouter = require('./routes/patient.route');

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(patientRouter);

app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }
};