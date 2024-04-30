import express from "express";
import {loginUser, logoutUser, userRegistration} from "../controllers/user.controller";
import {activateUser} from "../controllers/user.controller";

const userRouter = express.Router();
userRouter.post("/registation", userRegistration);
userRouter.post("/activation", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export default userRouter;


