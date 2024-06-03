import {Request, Response, NextFunction} from "express";
import {userModel} from "../models/user.model";

import ErrorHandler from "../utils/ErrorHandling";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import JWT from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMails";
import jwt from "jsonwebtoken";
import {sendToken} from "../utils/jwt";
import {redis} from "../utils/redis";


require("dotenv").config();


// interfaces for user regis body
interface UserRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

//interface for user login
interface ILoginRequest {
    email: string,
    password: string,
}


export const userRegistration = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body;
        const isEmailExist = await userModel.findOne({email});
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const user: UserRegistrationBody = {name, email, password};
        const activationToken = createActivationUser(user);
        const activationCode = activationToken.activationCode;
        const data = {user: {name: user.name}, activationCode};
        const html = await ejs.renderFile(path.join(__dirname, "../views/activation-mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationUser = (user: UserRegistrationBody): IActivationToken => {
    //returns four digit's activation code which you can receive on you email
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = JWT.sign({user, activationCode}, process.env.SECRET as string, {expiresIn: "5m"});
    return {token, activationCode};
};

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {activation_code, activation_token} = req.body;
        const decodedToken: any = jwt.verify(activation_token, process.env.SECRET as string);
        if (!decodedToken) {
            return next(new ErrorHandler("Invalid activation token", 400));
        }
        const {user, activationCode} = decodedToken;
        if (activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }
        const existingUser = await userModel.findOne({email: user.email});
        if (existingUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const newUser = await userModel.create(user);
        res.status(201).json({success: true});
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// login controller
export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {email, password} = req.body as ILoginRequest;
        if (!email || !password) {
            return next(new ErrorHandler("Enter email and password", 400));

        }
        const user = await userModel.findOne({email}).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid credentials", 400));

        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid credentials", 400));
        }

        sendToken(user, 200, res);


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear the access token cookie
        res.cookie("access_token", "", {maxAge: 0, httpOnly: true});

        // Clear the refresh token cookie
        res.cookie("refresh_token", "", {maxAge: 0, httpOnly: true});


        // Send a success response
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error: any) {
        // If an error occurs, pass it to the error handler middleware
        return next(new ErrorHandler(error.message || "Failed to logout", 500));
    }
};
