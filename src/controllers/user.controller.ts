import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";
import { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandling";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import JWT from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMails";
import jwt from "jsonwebtoken";

require("dotenv").config();

interface UserRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const userRegistration = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const user: UserRegistrationBody = { name, email, password };
        const activationToken = createActivationUser(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
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
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = JWT.sign({ user, activationCode }, process.env.SECRET as string, { expiresIn: "5m" });
    return { token, activationCode };
};

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_code, activation_token } = req.body;
        const decodedToken: any = jwt.verify(activation_token, process.env.SECRET as string);
        if (!decodedToken) {
            return next(new ErrorHandler("Invalid activation token", 400));
        }
        const { user, activationCode } = decodedToken;
        if (activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }
        const existingUser = await userModel.findOne({ email: user.email });
        if (existingUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const newUser = await userModel.create(user);
        res.status(201).json({ success: true });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
