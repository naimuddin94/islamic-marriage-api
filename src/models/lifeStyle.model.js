/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');
const { fiqhOption } = require('../lib');

const LifeStyle = sequelize.define(
  'LifeStyleInformation',
  {
    clothesInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breadInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clothesAnkles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prayInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qazaInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marhamInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reciteTheQuran: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fiqh: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [fiqhOption],
          msg: `Fiqh must be one of : ${fiqhOption.join(',')}`,
        },
      },
    },
    moviesOrSongs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    physicalDiseases: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workOfDeen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mazarInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    books: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    islamicScholars: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicable: {
      type: DataTypes.STRING,
    },
    hobbies: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groomMobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
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

User.hasOne(LifeStyle, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
LifeStyle.belongsTo(User);

module.exports = LifeStyle;
