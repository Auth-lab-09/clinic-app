'use strict';
// get
// acl , bearer

const express = require('express');
const dataModels = require('../models/index.model');
const bearerAuth = require('../middleware/bearer.auth');
const permissions = require('../middleware/acl.auth');

const patientRouter = express.Router();

patientRouter.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModels[modelName]) {
    req.model = dataModels[modelName];
    next();
  } else {
    next('Invalid model');
  }
});

patientRouter.get('/:model', bearerAuth, permissions('read'), handleGetAll);
patientRouter.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
patientRouter.post('/:model', bearerAuth, permissions('create'), handleCreate);
patientRouter.put(
  '/:model/:id',
  bearerAuth,
  permissions('update'),
  handleUpdate
);
patientRouter.delete(
  '/:model/:id',
  bearerAuth,
  permissions('delete'),
  handleDelete
);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(201).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(204).json(deletedRecord);
}

module.exports = patientRouter;
