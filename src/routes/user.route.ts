import express from"express";
import {userRegistration} from "../controllers/user.controller";
import {activateUser} from "../controllers/user.controller";

const userRouter = express.Router();
userRouter.post("/registation",userRegistration );
userRouter.post("/activation",activateUser );

export default userRouter;


