/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const MarriageInfo = sequelize.define(
  'MarriageInfo',
  {
    guardiansPermission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    veilAfterMarriage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerEducationPermission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerJobPermission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    liveInformationAfterMarriage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedGift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thoughtAboutMarriage: {
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

User.hasOne(MarriageInfo, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
MarriageInfo.belongsTo(User);

module.exports = MarriageInfo;
