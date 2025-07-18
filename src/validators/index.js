import { body,param, query } from 'express-validator';
//wtever we get req.body can be caught here



const userRegistrationValidator = () => {
    //we return an array keep an aye
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),
    


        body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("username must be 3 to 20 characters long"),

         body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("passowrd must min 3 to 20 characters"),

        
        body("role")
        .notEmpty()
        .withMessage("plz provide the role")
    ];
}


const userLoginValidtor =()=>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),



        body("password")
        .notEmpty()
        .withMessage("Password is required")
        
    ]
}

const userverificationUrl = ()=>{
    return [
        query("id")
        .notEmpty()
        .withMessage("Id is required"),


        query("token")
        .notEmpty()
        .withMessage("Token is required"),
        

        
    ]
}

const resendEmailUrl =()=>{
    return [
        body("email")
        .notEmpty()
        .withMessage("email cannot be empty")
    ]
}

const forgotPasswordRequestURl = ()=>{
    return [
        body("email")
        .notEmpty()
        .withMessage("email cannot be empty")
    ]
}


export { userRegistrationValidator, userLoginValidtor, userverificationUrl, resendEmailUrl, forgotPasswordRequestURl };