import { Router } from "express";
import { UserRolesEnum } from "../utils/constants.js";
import { validateprojectPermisiion } from "../middlewares/isloggedin.middleware.js";


const router = Router();


router.route(":/projectId")
        .get(getNotes)
        .post(
            validateprojectPermisiion([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER])
        )

export default router