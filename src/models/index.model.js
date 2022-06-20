'use strict';
require('dotenv').config();
const doctorTable = require('./doctor.mode');
const patientTable = require('./patient.model');
const Collection = require('./lib/collection.model');
const POSTGRES_URI =
  process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');

const sequelizeOptions =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
const patientTable2 = new Collection(patientTable(sequelize, DataTypes));
module.exports = {
  db: sequelize,
  doctor: doctorTable(sequelize, DataTypes),
  patient: patientTable2,
};
