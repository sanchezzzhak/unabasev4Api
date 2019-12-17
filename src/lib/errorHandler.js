// TODO deprecated

export const errorHandler = ({ err, res, from, status = 500, msg = "an error has ocurred" }) => {
  console.log(from);
  console.log("*-----------------*");
  console.log(err);
  console.log("*-----------------*");
  res.status(status).send({
    err,
    msg
  });
};
