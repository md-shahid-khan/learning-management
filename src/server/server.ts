import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import connectToDb from "../utils/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import {ErrorMiddleware} from "../middleware/error";

//variables and config
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 444;

//middlewares
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN,
}));

export const serverInit = () => {


    app.get("/", (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json({message: "Express + TypeScript Server"});
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
        connectToDb();
    });
    // checking for any error
    app.use(ErrorMiddleware);

}