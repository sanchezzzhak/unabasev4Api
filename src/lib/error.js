export const createError = (statusCode = 500, message = "server error.") => {
  let err = new Error();
  err.message = message;
  err.statusCode = statusCode;
  return err;
};

export const notFoundError = (msg = "Document(s) not found") => createError(404, msg);
export const missingData = (msg = "Missing data") => createError(400, msg);
