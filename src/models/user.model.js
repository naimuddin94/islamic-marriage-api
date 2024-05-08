/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
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
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
        notNull: {
          msg: 'Email is required.',
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
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Mobile number is required.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required.',
        },
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpExpiry: {
      type: DataTypes.DATE,
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
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    visitedBiodata: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hasBeenSortListed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sortListed: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      references: {
        model: 'User',
        key: 'id',
      },
    },
    ignoreList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      references: {
        model: 'User',
        key: 'id',
      },
    },
    purchased: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    connection: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['email', 'mobileNumber'],
      },
    ],
    hooks: {
      // Before saving the user instance, hash the password if it's changed or new
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }

        if (user.changed('email')) {
          user.email = user.email.toLowerCase();
        }
      },
    },
  },
);

User.belongsToMany(User, {
    as: 'SortedListed',
    through: 'SortListedUsers',
    foreignKey: 'userId',
});

User.belongsToMany(User, {
    as: 'IgnoreList',
    through: 'IgnoreListedUsers',
    foreignKey: 'userId',
});

// Custom method for password checking
User.prototype.isPasswordCorrect = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Custom method for generating access token
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

// Custom method for generating refresh token
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
