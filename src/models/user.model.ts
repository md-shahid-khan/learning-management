import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
// it must be written in / in this pattern /
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

};

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

userSchema.pre<IUser>("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//comparing the password which user provide

userSchema.methods.comparePassword = async function(enteredPassword: string):Promise<boolean>{
    return bcrypt.compare(enteredPassword, this.password);

}

const userModel: Model<IUser> = new mongoose.Model("User", userSchema);