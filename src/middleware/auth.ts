import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandling";
import { redis } from "../utils/redis";


require("dotenv").config();



export const isAuthenticated = async (req:Request, res:Response,next:NextFunction)=>{
    const access_token = req.cookies.access_token || " ";

    if (!access_token) {
        return next(new ErrorHandler("Invalid access token", 400));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
    console.log("decoded user",decoded);
    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    console.log("user info found here",user)

    req.user = JSON.parse(user);
    next();
}

