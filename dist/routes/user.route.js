"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.post("/registation", user_controller_1.userRegistration);
userRouter.post("/activation", user_controller_2.activateUser);
userRouter.post("/login", user_controller_1.loginUser);
userRouter.post("/logout", user_controller_1.logoutUser);
exports.default = userRouter;
