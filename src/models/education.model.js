/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const Education = sequelize.define(
  'Education',
  {
    medium: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDiplomaSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passingYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherQualifications: {
      type: DataTypes.STRING,
    },
    religiousEducation: {
      type: DataTypes.STRING,
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

User.hasOne(Education, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Education.belongsTo(User);

module.exports = Education;
