'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('patients', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    diagnose: {
      type: DataTypes.STRING,
    },
    cured: {
      type: DataTypes.ENUM('true', 'false'),
    },
  });
};
