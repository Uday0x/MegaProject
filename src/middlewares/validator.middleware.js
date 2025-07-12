import {  validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
//this is given by expres validator 


const validate = async(req , res ,next)=>{
    const errors = validationResult(req);
    //similar to req .user = decoded //in auth 
    
    
    if(errors.isEmpty()){
        return next()
    }

    const extractederrors = [];

    errors.array().map((err)=>[
        extractederrors.push({
            [err.path] :err.msg,
        }),
    ]);

    throw new ApiError(422 ,"Recieved data is not valid" , extractederrors)

}
