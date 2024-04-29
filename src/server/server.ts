import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectToDb from "../utils/database";

dotenv.config();

export const serverInit= ()=>{
    const app: Express = express();
    const port = process.env.PORT || 444;

    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript Server");
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
        connectToDb();
    });





}