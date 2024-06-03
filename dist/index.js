"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./utils/database"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const path_1 = __importDefault(require("path"));
//variables and config
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 444;
//middlewares
app.set("view engine", "ejs");
app.set("views", path_1.default.resolve("../views"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
}));
app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Express + TypeScript Server" });
});
//user registration routers
app.use("/api/v1", user_route_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    (0, database_1.default)();
});
// checking for any error
app.use(error_1.ErrorMiddleware);
