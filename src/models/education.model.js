/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');
const {
  medium,
  educationOptions,
  categories,
  resultOptions,
} = require('../lib');

const Education = sequelize.define(
  'Education',
  {
    medium: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [medium],
          msg: `Education medium must be one of: ${medium.join(', ')}`,
        },
      },
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [educationOptions],
          msg: `Education medium must be one of: ${educationOptions.join(', ')}`,
        },
      },
    },
    submission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [categories],
          msg: `Categories must be one of: ${categories.join(', ')}`,
        },
      },
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [resultOptions],
          msg: `Result must be one of: ${resultOptions.join(', ')}`,
        },
      },
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
