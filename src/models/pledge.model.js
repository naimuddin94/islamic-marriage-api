/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const Pledge = sequelize.define(
  'Pledge',
  {
    parentKnowSubmission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAllInfoTrue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    falseInfoProven: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['UserId'],
      },
    ],
  },
);

User.hasOne(Pledge, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Pledge.belongsTo(User);

module.exports = Pledge;
