// Error handling i am using object oriented programming so that reuse some
// code for multiple reason

class ErrorHandler extends Error {
    statusCode: Number;

    constructor(message: any, statusCode: Number) {

        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);


    }
}

export default ErrorHandler;