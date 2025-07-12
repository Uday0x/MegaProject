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
        .withMessage("username msut be 3 to 20 characters long"),

    ];
}


const userLoginValidtor =()=>{
    return [
        body("email")
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),



        body("password")
        .isEmpty()
        .withMessage("Password is required")
        
    ]
}