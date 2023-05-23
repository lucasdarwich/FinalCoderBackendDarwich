class CustomError {
  static createError({ message, errorCode }) {
    const error = new Error(message);
    error.code = errorCode;
    throw error;
  }
}

export { CustomError };
