/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');
const {
  biodataTypes,
  maritalStatus,
  heightArray,
  complexionOptions,
  weightOptions,
  bloodGroups,
} = require('../lib');

const PersonalInfo = sequelize.define(
  'PersonalInformation',
  {
    typeOfBiodata: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [biodataTypes],
          msg: `Biodata type must be one of: ${biodataTypes.join(', ')}`,
        },
      },
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [maritalStatus],
          msg: `Marital status must be one of: ${maritalStatus.join(', ')}`,
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [heightArray],
          msg: `Height must be one of: ${heightArray.join(', ')}`,
        },
      },
    },
    complexion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [complexionOptions],
          msg: `Complexion must be one of: ${complexionOptions.join(', ')}`,
        },
      },
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [weightOptions],
          msg: `Weight must be one of the following: ${weightOptions.join(
            ', ',
          )}`,
        },
      },
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [bloodGroups],
          msg: `Blood group be one of the following: ${bloodGroups.join(', ')}`,
        },
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['typeOfBiodata'],
      },
      {
        unique: false,
        fields: ['maritalStatus'],
      },
      {
        unique: true,
        fields: ['UserId'],
      },
    ],
  },
);

User.hasOne(PersonalInfo, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'cascade',
});
PersonalInfo.belongsTo(User);

module.exports = PersonalInfo;
