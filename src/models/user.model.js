import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto" //In-built no need to install
const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localpath: String,
      },
      default: {
        url: `https://placehold.co/600x400`,
        localpath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

//you can craete your own methods in userschema

//hasing th epassowrd 

userSchema.pre("save",async function (next) {
  if(!this.isModified("password"))  return next()
   this.password = await bcrypt.hash(this.password,10);
    next();
});


userSchema.methods.isPassowrdCorrect = async function(next){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAcccesToken  = async function(next){
    return jwt.sign({
        id :this._id,
        email :this.email,
        username:this.username, 
    },
    process.env.generateAcccesToken_Secret,

    {
      expiresIn:process.env.generateAcccesToken_Expiry
    }
  )
}


userSchema.methods.refreshToken = async function(next){
  return jwt.sign(
    {
    id:this._id, 
    //generally this is less heavy so we only have _.id 
    //reason ?//less data more secure
  },
  process.env.refreshToken_Secret,
  {
    expiresIn: process.env.refreshToken_Expiry
  }
)
}


userSchema.methods.temporaryToken = async function(next){
    const unhashedToken = crypto.randomBytes(32).toString("hex");

    //in some cases u have several databse complaince //
    //for that specfic reason we are hashing the crypto token as well 
    // we use crypto hash not bcryprt hash
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    const tokenexpiry =Date.now() + (20*60*1000);
    return { unhashedToken ,hashedToken ,tokenexpiry}
}
export const User = mongoose.model("User", userSchema);