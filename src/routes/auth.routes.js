import { Router } from "express";
import { forgotPasswordRequest, logoutUser, registerUser, resendEmailVerification, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { forgotPasswordRequestURl, resendEmailUrl, userRegistrationValidator, userverificationUrl } from "../validators/index.js";
import { loginUser } from "../controllers/auth.controller.js";
import { userLoginValidtor } from "../validators/index.js";
import { isLoggedIn } from "../middlewares/isloggedin.middleware.js";



const router = Router();

router.route("/register")
.post(userRegistrationValidator(), validate, registerUser);


router.route("/login")
.get(userLoginValidtor(),validate,loginUser);



router.route("/logout")
.get(userLoginValidtor(),validate,isLoggedIn,logoutUser)


router.route("/verify")
.get(userverificationUrl(),validate,verifyEmail)

router.route("/resendEmail")
.get(resendEmailUrl(),validate,resendEmailVerification)


router.route("/resetPassword")
.get(forgotPasswordRequestURl(),validate,forgotPasswordRequest)
export default router;
