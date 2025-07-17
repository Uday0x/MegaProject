import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";
import { loginUser } from "../controllers/auth.controller.js";
import { userLoginValidtor } from "../validators/index.js";


const router = Router();

router.route("/register")
.post(userRegistrationValidator(), validate, registerUser);


router.route("/login")
.get(userLoginValidtor(),validate,loginUser);

export default router;
