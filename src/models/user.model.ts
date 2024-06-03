import mongoose, {Document, Schema, Model} from "mongoose";
import bcrypt from "bcryptjs";
// it must be written in / in this pattern /
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
require("dotenv").config();
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    avatar: {
        public_id: string,
        url: string,
    },
    role: string,
    isVerified: boolean,
    courses: Array<{ courseId: string }>,
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string,
    SignRefreshToken: () => string,

}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value)
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


}, {timestamps: true})

//hashing the password using mongoose pre method when ever the document save
// it run the pre method for every time

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//providing access token for user when ever come back to log in this access token will
// be expire in every 5 mints
userSchema.methods.SignAccessToken = function (){
    return jwt.sign({id:this._id}, process.env.ACCESS_TOKEN as string);
}

//providing refresh token so that we can refresh the access token it is highly secure way to authenticate
//by using this way we can protect routes also
userSchema.methods.SignRefreshToken = function (){
    return jwt.sign({id:this._id}, process.env.REFRESH_TOKEN as string);
}

//comparing the password which user provide

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);

}


export const userModel: Model<IUser> = mongoose.model("User", userSchema);
