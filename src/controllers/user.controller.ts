import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";
import { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandling";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import JWT from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMails";

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








// import { Request, Response, NextFunction } from "express";
// import { userModel, IUser } from "../models/user.model";
// import ErrorHandler from "../utils/ErrorHandling";
// import JWT from "jsonwebtoken";
// import ejs from "ejs";
// import path from "path";
// import sendMail from "../utils/sendMails";
//
// require("dotenv").config();
//
// interface UserRegistrationBody {
//     name: string;
//     email: string;
//     password: string;
//     avatar?: string;
// }
// export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { name, email, password } = req.body;
//         const isEmailExist = await userModel.findOne({ email });
//         if (isEmailExist) {
//             return next(new ErrorHandler("Email already exists", 400));
//         }
//         const user: UserRegistrationBody = { name, email, password };
//         const newUser = new userModel(user); // Create a new user instance
//         await newUser.save(); // Save the user to the database
//
//         const activationToken = createActivationUser(user);
//         const activationCode = activationToken.activationCode;
//         const data = { user: { name: user.name }, activationCode };
//         const html = await ejs.renderFile(path.join(__dirname, "../views/activation-mail.ejs"), data);
//
//         try {
//             await sendMail({
//                 email: user.email,
//                 subject: "Activate your account",
//                 template: "activation-mail.ejs",
//                 data,
//             });
//             res.status(201).json({
//                 success: true,
//                 message: `Please check your email: ${user.email} to activate your account`,
//                 activationToken: activationToken.token,
//             });
//         } catch (error: any) {
//             return next(new ErrorHandler(error.message, 400));
//         }
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// };
//
// interface IActivationToken {
//     token: string;
//     activationCode: string;
// }
//
// export const createActivationUser = (user: UserRegistrationBody): IActivationToken => {
//     const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
//     const token = JWT.sign({ user, activationCode }, process.env.SECRET as string, { expiresIn: "5m" });
//     return { token, activationCode };
// };
//
// //user courses activation here
//
// interface IActivationRequest{
//     activation_token:string;
//     activation_code:string;
// }
//
//
//
//
//
//
//
