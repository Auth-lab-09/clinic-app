'use strict';
// get
// acl , bearer

const express = require('express');
const { doctor } = require('../models/index.model');
const bearerAuth = require('../middleware/bearer.auth');
const permissions = require('../middleware/acl.auth');

const doctorRouter = express.Router();

doctorRouter.get('/doctor', bearerAuth, permissions('read'), handleGetAll);
doctorRouter.get('/doctor/:id', bearerAuth, permissions('read'), handleGetOne);
doctorRouter.post('/doctor', bearerAuth, permissions('create'), handleCreate);
doctorRouter.put('/doctor/:id', bearerAuth, permissions('update'), handleUpdate);
doctorRouter.delete('/doctor/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await doctor.findAll();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await doctor.findOne({ where: { id: id } });
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await doctor.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let record = await doctor.findOne({ where: { id: id } });
  if (record) {
    let updatedRecord = await record.update(obj);
    res.status(201).json(updatedRecord);
  } else {
    res.status(404).json({ message: 'No ID was found' });
  }
}

async function handleDelete(req, res) {
  const id = req.params.id;
  let record = await doctor.findOne({ where: { id: id } });
  if (record) {
    let deletedRecord = await record.destroy({ where: { id: id } });
    res.status(204).json(deletedRecord);
  } else {
    res.status(404).json({ message: 'No ID was found' });
  }
}

module.exports = doctorRouter;