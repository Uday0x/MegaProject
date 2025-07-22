import { Router } from "express";
import { UserRolesEnum } from "../utils/constants.js";
import { validateprojectPermisiion } from "../middlewares/isloggedin.middleware.js";
import { getNotes } from "../controllers/note.controller.js";

const noteRouter = Router();


noteRouter.route("/:projectId")
        .get(getNotes)
        .post(
            validateprojectPermisiion([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER])
        )

export default noteRouter