import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResposne } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendMail } from "../utils/MAIL.JS";
import { emailVerificationMailgenContent } from "../utils/MAIL.JS";
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //validation

  //checking fot existingUser

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]  //both email and username is given unique (databse design)
  })

  if (existingUser) {
    throw new ApiError(202, "user already exists with this username and passowrd", false)
  }

  const user = await User.create({
    email,
    username,
    password,
    role
  })

  if (!user) {
    throw new ApiError(202, "user not craeted plz check", false)
  }
  //we created a method in userschema to genearte a temporary token
  const { unhashedToken, hashedToken, tokenexpiry } = await user.temporaryToken();

  //saving the token in the database
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenexpiry;


  await user.save();

  const verificationUrl = `${process.env.Base_url}/verify/${unhashedToken}`;

  const mailContent = await emailVerificationMailgenContent(user.username, verificationUrl);


  await sendMail({
    email: user.email,
    subject: "verify your email",
    mailgenContent: mailContent
  })


  return res.status(201).json(new ApiResponse(201, {
    id: user._id,
    username: user.username,
    email: user.email,
  }, "User registered successfully, please verify your email"));

});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

export {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
};
