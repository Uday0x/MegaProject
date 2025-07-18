import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js";
import { sendMail } from "../utils/mail.js"
import { emailVerificationMailgenContent } from "../utils/mail.js"
import bcrypt from "bcryptjs";

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
    console.log(user, "user created successfully")
  
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
  
    const verificationUrl = `${process.env.Base_url}/api/v1/users/verify?token=${unhashedToken}&id=${user.id}`;

  
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
  console.log("going inside try block")
  try {
    console.log("route hit")
    const { token , id } = req.query;
  
    if(!token || !id){
      throw new ApiError(202,"token not found ",false)
    }
    
    const user = await User.findById(id)
    console.log(user,"user found in verify email")

    if(!user || !user.emailVerificationToken){
        throw new ApiError(202,"user not found",false)
    }
  
    console.log("ismatch se pehle")
    const isMatch = await bcrypt.compare(token,user.emailVerificationToken)
     console.log("after isMatch")
    if(!isMatch){
      throw new ApiError(202,"token not matching",false)
    }

    console.log(isMatch,"isMatch is true")
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    console.log("idhar ayye")
    await user.save()
    console.log("user email verified successfully")

    return res.status(201).json(new ApiResponse(201, {
      id: user._id,
      emailVerificationToken:user.emailVerificationToken,
      isEmailVerified: user.isEmailVerified
    }, "User verified successfully"));


  } catch (error) {
    throw new ApiError(202,"something went wrong in verifying the email",false)
  }
});

const resendEmailVerification = async (req, res) => {
  const { email, username, password, role } = req.body;


  //testing done

try {
  
    //validation
    //validation
    //find user based on email from req.body
    //generate a token and save it in the user model
    //check if user is email verified
    //if yes send u r already verfied
    //if no send a mail with the token
    //resend the email verfication link again
  
  
    const user = await User.findOne({
        email
    })
    console.log(user,"user found")
  
    if(user.isEmailVerified){
      return ApiResponse(201,"user verified already",false)
      }
    
  
    //resend the email verfication link
      const { unhashedToken, hashedToken, tokenexpiry } = await user.temporaryToken();
    
      //saving the token in the database
      //its like giving the user a temporary token to verify their email
      //this token will be used to verify the email
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpiry = tokenexpiry;
    
    
      await user.save();
    
      const verificationUrl = `${process.env.Base_url}/api/v1/users/verify?token=${unhashedToken}&id=${user.id}`;
  
    
      const mailContent = await emailVerificationMailgenContent(user.username, verificationUrl);
    
    
      await sendMail({
        email: user.email,
        subject: "verify your email",
        mailgenContent: mailContent
      })
  
      
      return res.status(201).json(new ApiResponse(201, {
        id: user._id,
      }, "Email sent successfully"));
  
  }
   catch (error) {
      return new ApiError(200,"Resend the email again")
  }
}

const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
  
    //validation
    //extarct email
    //find user (FindOne)
    //generate a temporaray token //give it to the user
    //create a link and send to the user (email)
    const user =await User.findOne({
      email
    })
   console.log("reaching here")
    if(!user){
      return new ApiError(202,"user cannot be found",false)
    }
  
    const  { unhashedToken, hashedToken, tokenexpiry } = await user.temporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenexpiry;
    
    await user.save()
    console.log("await ke baad")
    const ResetPassowrdUrl = `${process.env.Base_url}/api/v1/users/verify?token=${unhashedToken}&id=${user.id}`;
  
    
    const mailContent = await emailVerificationMailgenContent(user.username, ResetPassowrdUrl);
    
    
      await sendMail({
        email: user.email,
        subject: "verify your email",
        mailgenContent: mailContent
      })
    
      return res.status(200).json(new ApiResponse (201,{
        id: user._id,
        forgotPasswordToken: user.forgotPasswordToken
      },"resetpassowrd token sent successfully"))
  }
   catch (error) {
     return new ApiError(202,"something wrong in sending the reset passowrd mail",false)
  }
}
;

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
