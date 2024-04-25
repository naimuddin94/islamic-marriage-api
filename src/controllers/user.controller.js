const User = require("../model/user.model");
const { ApiError, ApiResponse, asyncHandler } = require("../utils");

function emptyValidator(body, fieldList) {
  const errors = [];
  fieldList.forEach((key) => {
    if (!body[key]) {
      errors.push(`${key} is required`);
    }
  });

  return errors;
}

// create a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobileNumber, password, gender } = req.body;

  const errors = emptyValidator(req.body, [
    "fullName",
    "email",
    "mobileNumber",
    "password",
    "gender",
  ]);

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  const existsUser = await User.findOne({ email });

  if (existsUser) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    gender,
  });

  if (!user) {
    throw new ApiError(
      500,
      "Something went wrong creating the user to database"
    );
  }

  // Fetch the newly created user excluding the password field
  const createdUser = await User.findOne({
    where: { id: user.id },
    attributes: { exclude: ["password"] }, // Exclude the password field
  });
    
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Registration successfully"));
});

module.exports = { registerUser };
