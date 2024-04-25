const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db/index");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
