export default (req, res, next) => {
  const languages = new Map(
    Object.entries({
      es: {
        notFound: "usuario no existe",
        alreadyExist: "usuario o correo electrónica ya existe en el sistema",
        wrongPassword: "has ingresado una contraseña incorrecta",
        notActive: "usuario inactivo",
        successLogin: "te has logeado",
        verified: "cuenta verificada",
        notVerified: "la cuenta no se ha podido verificar"
      },
      en: {
        notFound: "user not found",
        alreadyExist: "username or email already exists",
        wrongPassword: "you have entered a wrong password",
        notActive: "user inactive1",
        successLogin: "Login succesful",
        verified: "account verified",
        notVerified: "the account could not be verified"
      }
    })
  );
  if (typeof req.user !== "undefined") {
    req.lg = languages.get(req.user.language || "es");
  } else if (req.locale.language) {
    req.lg = languages.get(req.locale.language || "es");
  } else {
    req.lg = languages.get("es");
  }
  next();
};
