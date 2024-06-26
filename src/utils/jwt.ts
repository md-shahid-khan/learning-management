import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

// Parse environment variables to integers
 const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
 const refreshTokenExpire = parseInt(process.env.ACCESS_REFRESH_EXPIRE || "1200", 10);

// Options for access token cookie
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire, 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};

// Options for refresh token cookie
export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire, 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 *  60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};


export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const accessRefreshToken = user.SignRefreshToken();

    // Saving user session in Redis
    redis.set(user._id.toString(), JSON.stringify(user));



    // Set secure to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    // Set cookies
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", accessRefreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
