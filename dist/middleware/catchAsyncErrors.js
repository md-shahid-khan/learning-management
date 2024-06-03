"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncError = void 0;
//this is a higher order function
const CatchAsyncError = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
};
exports.CatchAsyncError = CatchAsyncError;
