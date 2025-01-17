/* eslint-disable prettier/prettier */
/*
 * Title: Islamic Marriage Application
 * Description: A online marriage backend application with express
 * Author: Md Naim Uddin
 * Date: 25/04/2024
 *
 */

// dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { globalErrorHandler } = require('./lib/globalErrorHandler');
const { userRouter } = require('./routes/user.route');
const { authRouter } = require('./routes/auth.route');
const { adminRouter } = require('./routes/admin.route');
const biodataRouter = require('./routes/biodata.route');

const app = express();

// static files
app.use('/uploads', express.static('uploads'));

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://islamicmarriage.vercel.app',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

// routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/biodata', biodataRouter);

// testing route
app.get('/', (req, res) => {
    res.send('Server is running....');
});

// handling all route which is not found
app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on the server`);
    error.status = 404;
    next(error);
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
