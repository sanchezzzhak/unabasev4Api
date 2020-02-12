// TODO deprecated

export const errorHandler = ({ err, res, from, status = 500, msg = "an error has ocurred" }) => {
  logy(from);
  logy("*-----------------*");
  logy(err);
  logy("*-----------------*");
  res.status(status).send({
    err,
    msg
  });
};
