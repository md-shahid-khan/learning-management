"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandling_1 = __importDefault(require("../utils/ErrorHandling"));
const redis_1 = require("../utils/redis");
require("dotenv").config();
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token || " ";
    if (!access_token) {
        return next(new ErrorHandling_1.default("Invalid access token", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    console.log("decoded user", decoded);
    if (!decoded) {
        return next(new ErrorHandling_1.default("Access token is not valid", 400));
    }
    const user = yield redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandling_1.default("User not found", 404));
    }
    console.log("user info found here", user);
    req.user = JSON.parse(user);
    next();
});
exports.isAuthenticated = isAuthenticated;
