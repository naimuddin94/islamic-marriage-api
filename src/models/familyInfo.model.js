/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const FamilyInfo = sequelize.define(
  'FamilyInformation',
  {
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isFatherAlive: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherOccupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMotherAlive: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motherOccupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationInstitute: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brothersCount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brotherInformation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sistersCount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sisterInformation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupationOfUnclesAndAunts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyIncome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyReligionEnvironment: {
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

User.hasOne(FamilyInfo, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
FamilyInfo.belongsTo(User);

module.exports = FamilyInfo;
