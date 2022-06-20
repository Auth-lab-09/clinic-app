'use strict';

const base64 = require('base-64');
const { doctor } = require('../models/index.model');

module.exports = async (req, res, next) => {

  let basic = req.headers.authorization.split(' ').pop();
  let [username, password] = base64.decode(basic).split(':');

  try {
    req.user = await doctor.authenticateBasic(username, password)
    next();
  } catch (e) {
    next(e.message);
  }
}