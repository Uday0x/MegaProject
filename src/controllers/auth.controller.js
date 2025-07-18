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
    //its like giving the user a temporary token to verify their email
    //this token will be used to verify the email
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenexpiry;
  
  
    await user.save();
  
    const verificationUrl = `${process.env.Base_url}/verify?token=${unhashedToken}&id=${user.id}`;

  
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
    
    const user =await User.findOne({
      email
    })
    // console.log(user.email,"user toh mil rha hai")
    if (!user) {
      throw new ApiError(202, "user not found", false)
    }

    //comapring the hashed passowrd 
    const isMatch = await user.isPassowrdCorrect(password)
    console.log("ismatch ho rha hai hai ki nhi?",isMatch)
    if (!isMatch) {
      throw new ApiError(202, "passowrd not matching at the hashing level", false)
    }


    //setting the jwt token
    const token = await user.generateAcccesToken();

    const cookieoptions = {
      httpOnly: true,
      secure: true,
      expiresIn: 24 * 60 * 60 * 1000
    }

    res.cookie("token", token, cookieoptions)


    return res.status(201).json(new ApiResponse(201, {
      token,

    }, "user verification done succesfully"));

  } catch (error) {
    throw new ApiError(202, "something went wrong in logging in plz check", false)
  }

});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
      sameSite: "lax",
    });

    return res.status(201).json(
      new ApiResponse(201, null, "User logged out successfully")
    );
  } catch (error) {
    throw new ApiError(200, "Some problem in logging the user out", false);
  }
});


const verifyEmail = asyncHandler(async (req, res) => {

  //validation
  //take the token from url
  //unhash the token from database
  //if the URL matches 
  //set isVerfied to true 

  const { token , id } = req.params;

  if(!token || !id){
    throw new ApiError(202,"token not found ",false)
  }

  const user = await User.findById(id)

  if(!user || !user.emailVerificationToken){
      throw new ApiError(202,"user not found",false)
  }


  const isMatch = await bcrypt.compare(unhashedToken,user.verificationUrl)

  if(!isMatch){
    return new ApiError(202,"token not matching",false)
  }
  user.isEmailVerified = true;
  user.verificationUrl = null;
  await user.save()

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
