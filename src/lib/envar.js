import dotenv from "dotenv";
dotenv.config();

export default function envar() {
  const env = process.env.NODE_ENV;
  const dbs = new Map();
  dbs.set("test", process.env.DB_TEST);
  dbs.set("dev", process.env.DB_DEV);
  dbs.set("dev4", process.env.DB_DEV4);
  dbs.set("prod", process.env.DB_PROD);
  dbs.set("una", process.env.DB_UNA);
  return {
    SECRET: process.env.SECRET,
    DB_PASS: process.env.DB_PASS,
    DB_USER: process.env.DB_USER,
    DB_PASS4: process.env.DB_PASS4,
    DB_USER4: process.env.DB_USER4,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER,
    DB_CONN: dbs.get(env),
    DB_TEST: process.env.DB_TEST,
    DB_DEV: process.env.DB_DEV,
    DB_DEV4: process.env.DB_DEV4,
    DB_PROD: process.env.DB_PROD,
    DB_UNA: process.env.DB_UNA,
    mailApiKey: process.env.mailApiKey,
    VAPID_PUBLIC: process.env.VAPID_PUBLIC,
    VAPID_PRIVATE: process.env.VAPID_PRIVATE
  };
}
