export const createError = (statusCode = 500, message = "server error.") => {
  let err = new Error();
  err.message = message;
  err.statusCode = statusCode;
  return err;
};

export const NotFoundError = (msg = "Document not found") => createError(404, msg);
