import api_doc from 'unabase_api_doc';
// send enviroment as arguments ["test","dev","local","prod"]

let env = process.env.NODE_ENV === 'dest' ? 'test' : process.env.NODE_ENV;
const api = api_doc(env);
// const api = api_doc('env');
// console.log(api);
// console.log(process.env);

export default api;
