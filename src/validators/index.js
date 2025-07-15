import { body } from 'express-validator';
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
        .islength({ min: 3, max: 20 })
        .withMessage("username must be 3 to 20 characters long"),

         body("password")
        .notEmpty()
        .withMessage("Password is required")
        .islength({ min: 3, max: 20 })
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

export { userRegistrationValidator, userLoginValidtor };