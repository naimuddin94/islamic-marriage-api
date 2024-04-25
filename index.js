/*
 * Title: Islamic Marriage Application
 * Description: A online marriage backend application with express
 * Author: Md Naim Uddin
 * Date: 25/04/2024
 *
 */

// dependencies
require("dotenv").config();
const app = require("./src/app");
const { sequelize, createDatabase } = require("./src/db");
const http = require("http");
const port = process.env.PORT || 5000;
const server = http.createServer(app);

(async () => {
  try {
    await createDatabase(); 
    await sequelize.authenticate(); // Authenticate Sequelize
    console.log("Connection has been established successfully.");
    await sequelize.sync(); // Sync models
    server.listen(port, () => {
      console.log(`🛩️ Server listening on ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
