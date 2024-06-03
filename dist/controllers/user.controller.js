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
exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationUser = exports.userRegistration = void 0;
const user_model_1 = require("../models/user.model");
const ErrorHandling_1 = __importDefault(require("../utils/ErrorHandling"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
require("dotenv").config();
exports.userRegistration = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = yield user_model_1.userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandling_1.default("Email already exists", 400));
        }
        const user = { name, email, password };
        const activationToken = (0, exports.createActivationUser)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../views/activation-mail.ejs"), data);
        try {
            yield (0, sendMails_1.default)({
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
        }
        catch (error) {
            return next(new ErrorHandling_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandling_1.default(error.message, 400));
    }
}));
const createActivationUser = (user) => {
    //returns four digit's activation code which you can receive on you email
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.SECRET, { expiresIn: "5m" });
    return { token, activationCode };
};
exports.createActivationUser = createActivationUser;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_code, activation_token } = req.body;
        const decodedToken = jsonwebtoken_2.default.verify(activation_token, process.env.SECRET);
        if (!decodedToken) {
            return next(new ErrorHandling_1.default("Invalid activation token", 400));
        }
        const { user, activationCode } = decodedToken;
        if (activationCode !== activation_code) {
            return next(new ErrorHandling_1.default("Invalid activation code", 400));
        }
        const existingUser = yield user_model_1.userModel.findOne({ email: user.email });
        if (existingUser) {
            return next(new ErrorHandling_1.default("Email already exists", 400));
        }
        const newUser = yield user_model_1.userModel.create(user);
        res.status(201).json({ success: true });
    }
    catch (error) {
        return next(new ErrorHandling_1.default(error.message, 400));
    }
}));
// login controller
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandling_1.default("Enter email and password", 400));
        }
        const user = yield user_model_1.userModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandling_1.default("Invalid credentials", 400));
        }
        const isPasswordMatch = yield user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandling_1.default("Invalid credentials", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandling_1.default(error.message, 400));
    }
}));
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the access token cookie
        res.cookie("access_token", "", { maxAge: 0, httpOnly: true });
        // Clear the refresh token cookie
        res.cookie("refresh_token", "", { maxAge: 0, httpOnly: true });
        // Send a success response
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        // If an error occurs, pass it to the error handler middleware
        return next(new ErrorHandling_1.default(error.message || "Failed to logout", 500));
    }
});
exports.logoutUser = logoutUser;
