/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Settings = sequelize.define('Settings', {
  stripePublisherKey: {
    type: DataTypes.STRING,
  },
  stripeSecretKey: {
    type: DataTypes.STRING,
  },
  payPalClientKey: {
    type: DataTypes.STRING,
  },
  zellePayNumber: {
    type: DataTypes.STRING,
  },
  smsApi: {
    type: DataTypes.STRING,
  },
  smsApiKey: {
    type: DataTypes.STRING,
  },
  smsSenderId: {
    type: DataTypes.STRING,
  },
  adminEmailAddress: {
    type: DataTypes.STRING,
  },
  successfulMarriage: {
    type: DataTypes.STRING,
  },
  youtubeEmbedVideoLink: {
    type: DataTypes.STRING,
  },
  logo: {
    type: DataTypes.STRING,
  },
});

module.exports = Settings;
