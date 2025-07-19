import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js"
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";




export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.generateAcccesToken_Secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    throw new ApiError(401, "Invalid or expired token", false);
  }
};

//in majority of projects permissions are handled by middlewares

export const validateprojectPermisiion =(roles = [])=>
  asyncHandler(async(req,res,next)=>{
      const {projectId} = req.params;

      if(!projectId){
        throw new ApiError(501,"projectId not found",false)
      }
      
      const projectmembers = await ProjectMember.findOne({
        project:mongoose.Types.ObjectId(projectId), //sometimes params value changes it to string //better change it to id
        user:mongoose.Types.ObjectId(req.user._id)
      })

      if(!projectmembers){
        throw new ApiError(401,"Project not found",false)
      }

      const givenRole = projectmembers?.role
       
      req.user.role = givenRole

      if(!roles.includes(givenRole)){
          throw new ApiError(403,"You do not have permission to perform the action",false)
      }
  })
   