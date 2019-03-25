const apis = new Map();
apis.set('test', 'https://test.unabase.net');
apis.set('dev', 'https://dev.unabase.net');
apis.set('prod', 'https://api.unabase.net');
apis.set('local', 'http://localhost:3000');

let env = process.env.NODE_ENV === 'dest' ? 'test' : process.env.NODE_ENV;
const api = apis.get(env);
// const api = api_doc('env');
// console.log(api);
// console.log(process.env);

export default api;
