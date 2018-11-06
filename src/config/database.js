// import main from './main';
import envar from '../lib/envar';
console.log(envar());
export default {
  // dev: `mongodb://${main.host}:27020/unabase`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  dev: `mongodb://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_DEV}`,
  una: `mongodb://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_UNA}`,
  test: `mongodb://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_TEST}`,
  local: `mongodb://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_TEST}`,
  prod: `mongodb://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_PROD}`
};
