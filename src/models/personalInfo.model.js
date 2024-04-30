/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const PersonalInfo = sequelize.define(
    'PersonalInformation',
    {
        typeOfBiodata: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        maritalStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        complexion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bloodGroup: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nationality: {
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

User.hasOne(PersonalInfo, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'cascade',
});
PersonalInfo.belongsTo(User);

module.exports = PersonalInfo;
