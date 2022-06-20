'use strict';

const { doctor } = require('../models/index.model');

module.exports = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await doctor.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    next(e.message);
  }
}