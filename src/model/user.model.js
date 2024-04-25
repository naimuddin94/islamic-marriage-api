const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: "Name is required.",
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: "Email is required.",
    },
    validate: {
      isEmail: {
        msg: "Invalid email format",
      }
    }
  },
  gender: {
    type: DataTypes.STRING,
    validate: {
      isIn: {
        args: [["male", "female"]],
        msg: "Gender must be one of: male or female",
      },
    },
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: "Mobile number is required.",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: "Password is required.",
    },
  },
});

module.exports = User;
