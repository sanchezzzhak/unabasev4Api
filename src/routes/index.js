import express from "express";
const routes = express.Router();
import { isAuth, isAuthOptional } from "../config/lib/auth";
import language from "../language";

routes.use(language);
routes.use(parseQueryUrl);

routes.get("/", (req, res) => {
  logy(req.headers.host);
  res.send({ msg: `Unabase api. ${process.env.NODE_ENV}` });
});

routes.get("/isAuth", isAuth, (req, res) => {
  res.statusMessage = "authenticated";
  res.send(req.user.getUser());
});
import auth from "./auth";
import user from "./user";
import business from "./business";
import movement from "./movement";
import tax from "./tax";
import item from "./item";
import currency from "./currency";
import mailer from "./mailer";
import log from "./log";
import line from "./line";
import comment from "./comment";
import contact from "./contact";
import permission from "./permission";
import userPermission from "./userPermission";
import role from "./role";
import empresa from "./empresa";
import report from "./report";
import push from "./push";
import notification from "./notification";
import section from "./section";
import itemAlias from "./itemAlias";
import relation from "./relation";
import link from "./link";
import userNoAuth from "./user_noAuth";
import { parseQueryUrl } from "../middleware/parseQueryUrl";

// TODO verify session for all routes

routes.use("/", isAuthOptional, userNoAuth);
routes.use("/auth", auth);
routes.use("/users", isAuth, user);
routes.use("/business", isAuth, business);
routes.use("/movements", isAuth, movement);
routes.use("/taxes", isAuth, tax);
routes.use("/items", isAuth, item);
routes.use("/currencies", isAuth, currency);
routes.use("/mailer", isAuth, mailer);
routes.use("/logs", isAuth, log);
routes.use("/lines", isAuth, line);
routes.use("/comments", isAuth, comment);
routes.use("/contacts", isAuth, contact);
routes.use("/permissions", isAuth, permission);
routes.use("/userPermissions", isAuth, userPermission);
routes.use("/roles", isAuth, role);
routes.use("/empresas", isAuth, empresa);
routes.use("/reports", isAuth, report);
routes.use("/push", isAuth, push);
routes.use("/notifications", isAuth, notification);
routes.use("/sections", isAuth, section);
routes.use("/itemAlias", isAuth, itemAlias);
routes.use("/relations", isAuth, relation);
routes.use("/links", isAuth, link);

routes.post("/t", (req, res) => {
  res.send({ body: req.body, headers: req.headers });
});

export default routes;
