const { Sequelize } = require("sequelize");

// create database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
      host: process.env.DB_HOST,
      dialect: "mysql"
  }
);

// function to create the database if it doesn't exist
async function createDatabase() {
    try {
      // Check if the database already exists
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log("Database created successfully or already exists");
    } catch (error) {
        console.error("Error creating database:", error);
    }
}

module.exports = { sequelize, createDatabase };
