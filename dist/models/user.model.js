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
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// it must be written in / in this pattern /
const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: "please enter a valid email"
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: [8, "password must be at least 8 characters "],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }
    ]
}, { timestamps: true });
//hashing the password using mongoose pre method when ever the document save
// it run the pre method for every time
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
//providing access token for user when ever come back to log in this access token will
// be expire in every 5 mints
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN);
};
//providing refresh token so that we can refresh the access token it is highly secure way to authenticate
//by using this way we can protect routes also
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN);
};
//comparing the password which user provide
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
exports.userModel = mongoose_1.default.model("User", userSchema);
