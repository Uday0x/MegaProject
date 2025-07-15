import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResposne } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent } from "../utils/MAIL.JS";
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //validation

  //checking fot existingUser

  const existingUser = await User.findOne({
     $or:[{email}, {username}]  //both email and username is given unique (databse design)
  }) 

  if(existingUser){
    throw new ApiError(202,"user already exists with this username and passowrd",false)
  }

  const user = await User.create({
    email,
    username,
    password,
    role
  })

  if(!user){
    throw new ApiError(202,"user not craeted plz check",false)
  }
 

  
  


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
