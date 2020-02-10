// const requestLocale = req.locale.language;
import es from "./es/";
import en from "./en/";

const languages = {
  es,
  en
};
// let locale = languages[requestLocale];

export default (req, res, next) => {
  if (typeof req.user !== "undefined") {
    req.lg = languages[req.user.language || "es"];
  } else if (req.locale.language) {
    req.lg = languages[req.locale.language || "es"];
  } else {
    req.lg = languages["es"];
  }
  next();
};
