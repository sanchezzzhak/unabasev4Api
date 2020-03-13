import express from "express";
const routes = express.Router();
import { sToken } from "../config/lib/auth";
import language from "../language";

routes.use(language);
routes.use(parseQueryUrl);

routes.get("/", (req, res) => {
  logy(req.headers.host);
  res.send({ msg: `Unabase api. ${process.env.NODE_ENV}` });
});

routes.get("/isAuth", sToken, (req, res) => {
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
import { parseQueryUrl } from "../middleware/parseQueryUrl";

// TODO verify session for all routes

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/business", business);
routes.use("/movements", movement);
routes.use("/taxes", tax);
routes.use("/items", item);
routes.use("/currencies", currency);
routes.use("/mailer", mailer);
routes.use("/logs", log);
routes.use("/lines", line);
routes.use("/comments", comment);
routes.use("/contacts", contact);
routes.use("/permissions", permission);
routes.use("/userPermissions", userPermission);
routes.use("/roles", role);
routes.use("/empresas", empresa);
routes.use("/reports", report);
routes.use("/push", push);
routes.use("/notifications", notification);
routes.use("/sections", section);
routes.use("/itemAlias", itemAlias);
routes.post("/t", (req, res) => {
  res.send({ body: req.body, headers: req.headers });
});

export default routes;
