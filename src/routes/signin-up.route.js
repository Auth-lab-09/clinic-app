'use strict';
// basic
const express = require('express');
const authRouter = express.Router();

const basicAuth = require('../middleware/basic.auth');
const bearerAuth = require('../middleware/bearer.auth');
const permissions = require('../middleware/acl.auth');
const { doctor } = require('../models/index.model');

authRouter.post('/signup', async (req, res) => {
  try {
    let userRecord = await doctor.create(req.body);
    res.status(201).json(userRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

authRouter.post('/signin', basicAuth, (req, res) => {
  let user = req.user;
  res.status(200).json(user);
});

authRouter.get(
  '/users',
  bearerAuth,
  permissions('read'),
  async (req, res, next) => {
    const userRecords = await doctor.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  }
);

authRouter.post(
  '/users',
  bearerAuth,
  permissions('create'),
  async (req, res, next) => {
    const userRecords = await doctor.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  }
);

authRouter.put(
  '/users',
  bearerAuth,
  permissions('update'),
  async (req, res, next) => {
    const userRecords = await doctor.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  }
);

authRouter.delete(
  '/users',
  bearerAuth,
  permissions('delete'),
  async (req, res, next) => {
    const userRecords = await doctor.findAll({});
    const list = userRecords.map((user) => user.username);
    res.status(200).json(list);
  }
);

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;
