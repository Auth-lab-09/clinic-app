'use strict';
const SECRET = process.env.SECRET || 'HeyThereAye';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const doctor = (sequelize, Datatypes) => {
  const model = sequelize.define('doctors', {
    username: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    role: {
      type: Datatypes.ENUM('trainee', 'intermediate', 'advanced', 'head'),
      deafult: 'trainee',
    },
    actions: {
      type: Datatypes.VIRTUAL,
      get() {
        const acl = {
          trainee: ['read'],
          intermediate: ['read', 'create'],
          advanced: ['read', 'create', 'update'],
          head: ['read', 'create', 'update', 'delete'],
        };
        return acl[this.role];
      },
    },
    token: {
      type: Datatypes.VIRTUAL,
    },
  });
  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });
  model.authenticateBasic = async (username, password) => {
    let user = await model.findOne({ where: { username: username } });
    let valid = await bcrypt.compare(password, user.password);

    if (valid) {
      let newToken = jwt.sign({ username: user.username }, SECRET, {
        expiresIn: '1h',
      });
      user.token = newToken;
      return user;
    } else {
      throw new Error('Invalid Credintials, userModel');
    }
  };
  model.authenticateToken = async (token) => {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await model.findOne({
      where: { username: parsedToken.username },
    });
    if (user.username) {
      return user;
    } else {
      throw new Error('You need a token, userModel');
    }
  };
  return model;
};

module.exports = doctor;
