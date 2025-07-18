class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = "",
        success = false // ✅ Added this line
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
