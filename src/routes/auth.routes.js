import { Router } from "express";
import { logoutUser, registerUser, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator, userverificationUrl } from "../validators/index.js";
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
export default router;
