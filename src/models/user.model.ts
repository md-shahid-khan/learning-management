import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
// it must be written in / in this pattern /
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


