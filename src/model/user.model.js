/* eslint-disable prettier/prettier */
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../db');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: {
                args: false,
                msg: 'Name is required.',
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Email already exists',
            },
            allowNull: {
                args: false,
                msg: 'Email is required.',
            },
            validate: {
                isEmail: {
                    msg: 'Invalid email format',
                },
            },
        },
        gender: {
            type: DataTypes.STRING,
            validate: {
                isIn: {
                    args: [['male', 'female']],
                    msg: 'Gender must be one of: male or female',
                },
            },
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: {
                args: false,
                msg: 'Mobile number is required.',
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: {
                args: false,
                msg: 'Password is required.',
            },
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'basic',
            validate: {
                isIn: {
                    args: [['admin', 'moderator', 'mentor', 'basic']],
                    msg: 'Role must be one of: admin, moderator, mentor, basic',
                },
            },
        },
    },
    {
        hooks: {
            // Before saving the user instance, hash the password if it's changed or new
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    // eslint-disable-next-line no-param-reassign
                    user.password = await bcrypt.hash(user.password, salt);
                }

                if (user.changed('email')) {
                  // eslint-disable-next-line no-param-reassign
                  user.email = user.email.toLowerCase();
                }
            },
        },
    },
);

// create custom method for password checking
User.prototype.isPasswordCorrect = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create access token method
User.prototype.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
};

// create access token method
User.prototype.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};

module.exports = User;
