import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js";
import { sendMail } from "../utils/mail.js"
import { emailVerificationMailgenContent } from "../utils/mail.js"


const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //validation

  //checking fot existingUser

  try {
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
  
  } catch (error) {
    throw new ApiError(202,"something wnet wrong in registering the user",false)
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    //validation //user login vlaidator we pass it in route
    const user = User.findOne({
      email
    })

    if (!user) {
      throw new ApiError(202, "user not found", false)
    }

    //comapring the hashed passowrd 
    const isMatch = await user.isPassowrdCorrect()

    if (!isMatch) {
      throw new ApiError(202, "passowrd not matching at the hashing level", false)
    }


    //setting the jwt token
    const token = user.generateAcccesToken();

    const cookieoptions = {
      httpOnly: true,
      secure: true,
      expiresIn: 24 * 60 * 60 * 1000
    }

    res.cookie("token", token, cookieoptions)


    return res.status(201).json(new ApiResponse(201, {
      token
    }, "user verification doen succesfully"));

  } catch (error) {
    throw new ApiError(202, "something went wrong in logging in plz check", false)
  }

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
