"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const accessRefreshToken = user.SignRefreshToken();
    //uploading session to redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    //parse environment variable to integers with callback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
    const refreshTokenExpire = parseInt(process.env.ACCESS_REFRESH_EXPIRE || "1200", 10);
    //options for cookies
    const accessTokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    };
    const refreshTokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    };
    // only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessTokenOptions);
    res.cookie("refresh_token", refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
