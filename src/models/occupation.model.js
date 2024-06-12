/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');
const { occurrenceOption } = require('../lib');

const Occupation = sequelize.define(
  'Occupation',
  {
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [occurrenceOption],
          msg: `Occupation must be one of: ${occurrenceOption.join(', ')}`,
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthlyIncome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['occupation'],
      },
      {
        unique: true,
        fields: ['UserId'],
      },
    ],
  },
);

User.hasOne(Occupation, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Occupation.belongsTo(User);

module.exports = Occupation;
