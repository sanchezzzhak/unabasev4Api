export const handleError = (err, res) => {
  const { statusCode = 500, message } = err;
  console.error(err);
  console.error("Error: ====> " + message);
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
};
