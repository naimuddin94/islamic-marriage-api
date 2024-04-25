require("dotenv").config();
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// Create database connection
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
    }
  );

// Function to create the database if it doesn't exist
async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log("Database created successfully or already exists");
  } catch (error) {
    console.error("Error creating database:", error);
  }
}



module.exports = { sequelize, createDatabase };
