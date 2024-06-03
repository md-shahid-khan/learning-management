"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorHandling_1 = __importDefault(require("../utils/ErrorHandling"));
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    //if there is wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resources not found Invalid ${err.path}`;
        err = new ErrorHandling_1.default(message, 400);
    }
    //duplicate key error
    if (err.code === 1100) {
        const message = `Deplicate ${Object.keys(err.keyValue)}entered`;
        err = new ErrorHandling_1.default(message, 400);
    }
    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token invalid, try again`;
        err = new ErrorHandling_1.default(message, 400);
    }
    // jwt expired error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired, try again`;
        err = new ErrorHandling_1.default(message, 400);
    }
    // if there is any errors then the response
    res.status(err.statusCode).json({ success: false, message: err.message });
};
exports.ErrorMiddleware = ErrorMiddleware;
