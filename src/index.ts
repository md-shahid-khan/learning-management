import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import connectToDb from "./utils/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import {ErrorMiddleware} from "./middleware/error";
import userRouter from "./routes/user.route";
import path from "path";
import {IUser} from "./models/user.model";

//variables and config
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 444;

//middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("../views"));
app.use(express.json({limit: "50mb"}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN,
}));
declare global {
    namespace Express {
        export interface Request {
            user: IUser; // Change `any` to the type of your user object if available
        }
    }
}


app.get("/", (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({message: "Express + TypeScript Server"});
});
//user registration routers
app.use("/api/v1", userRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    connectToDb()
});
// checking for any error
app.use(ErrorMiddleware);

