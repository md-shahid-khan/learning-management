import express from "express";
import {loginUser, logoutUser, userRegistration} from "../controllers/user.controller";
import {activateUser} from "../controllers/user.controller";
import {isAuthenticated} from "../middleware/auth";


const userRouter = express.Router();
userRouter.post("/registation", userRegistration);
userRouter.post("/activation", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",isAuthenticated, logoutUser);

export default userRouter;


