import express from "express";
import {loginUser, logoutUser, updateAccessToken, userRegistration} from "../controllers/user.controller";
import {activateUser} from "../controllers/user.controller";
import {isAuthenticated} from "../middleware/auth";


const userRouter = express.Router();
userRouter.post("/registation", userRegistration);
userRouter.post("/activation", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",isAuthenticated, logoutUser);
userRouter.get("/refresh-token", updateAccessToken);

export default userRouter;


