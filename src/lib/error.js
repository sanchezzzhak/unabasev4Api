export const createError = (statusCode = 500, message = "server error.") => {
  let err = new Error();
  err.message = message;
  err.statusCode = statusCode;
  return err;
};
