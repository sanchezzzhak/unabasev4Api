// const api = "http://35.231.73.122:3000/";
const api = 'http://localhost:3000/';
// const api = "http://192.168.0.196:3000/";
// const api = "https://unabase.net/";
// const api = 'https://unabase.es/';

import tax from './tax';
import item from './item';
import user from './user';
import auth from './auth';
import business from './business';
import outcome from './outcome';
import income from './income';
// import task from './task';

export default {
  tax: tax(api),
  item: item(api),
  user: user(api),
  auth: auth(api),
  business: business(api),
  outcome: outcome(api),
  income: income(api)
  // task: task(api)
};
