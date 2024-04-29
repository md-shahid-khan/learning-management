import express from"express";
import {userRegistration} from "../controllers/user.controller";

const userRouter = express.Router();
userRouter.post("/user",userRegistration );

export default userRouter;


