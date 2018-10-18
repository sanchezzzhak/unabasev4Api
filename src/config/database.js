import main from './main';

export default {
  // dev: `mongodb://${main.host}:27020/unabase`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  dev: `mongodb://${main.user}:${main.pass}@${main.db.dev}`,
  una: `mongodb://${main.user}:${main.pass}@${main.db.una}`,
  test: `mongodb://${main.user}:${main.pass}@${main.db.test}`,
  prod: `mongodb://${main.user}:${main.pass}@${main.db.prod}`
};
