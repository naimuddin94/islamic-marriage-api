/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const Contact = sequelize.define(
  'Contact',
  {
    groomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guardianMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guardianRelationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
              msg: 'Please enter a valid email address',
          },
      },
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

User.hasOne(Contact, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Contact.belongsTo(User);

module.exports = Contact;
