/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const Address = sequelize.define(
  'Address',
  {
    permanentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSameCurrentAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    currentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (this.isSameCurrentAddress) {
          this.setDataValue('currentAddress', this.permanentAddress);
        } else {
          this.setDataValue('currentAddress', value);
        }
      },
    },
    growUp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['permanentAddress'],
      },
      {
        unique: true,
        fields: ['UserId'],
      },
    ],
  },
);

User.hasOne(Address, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Address.belongsTo(User);

module.exports = Address;
