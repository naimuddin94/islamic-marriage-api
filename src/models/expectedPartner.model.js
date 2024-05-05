/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');
const { maritalStatus, complexionOptions } = require('../lib');

const Partner = sequelize.define(
  'Partner',
  {
    ageRange: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidAgeRange(value) {
          if (
            !Array.isArray(value)
            || value.length !== 2
            || !value.every((num) => typeof num === 'number')
          ) {
            throw new Error('Age range must be an array of two numbers');
          }
        },
      },
    },
    complexion: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidMaritalStatus(value) {
          if (
            !Array.isArray(value)
            || value.length === 0
            || !value.every((status) => complexionOptions.includes(status))
          ) {
            throw new Error(
              `Marital status must be one of: ${complexionOptions.join(', ')}`,
            );
          }
        },
      },
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationalQualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MaritalStatus: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidMaritalStatus(value) {
          if (
            !Array.isArray(value)
            || value.length === 0
            || !value.every((status) => maritalStatus.includes(status))
          ) {
            throw new Error(
              `Marital status must be one of: ${maritalStatus.join(', ')}`,
            );
          }
        },
      },
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    financialCondition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedQuality: {
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

User.hasOne(Partner, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Partner.belongsTo(User);

module.exports = Partner;
