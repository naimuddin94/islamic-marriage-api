const { Router } = require("express");
const { registerUser } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.route("/register").post(registerUser);


module.exports = { userRouter}