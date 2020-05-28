import server from "./server";
import logy from "./config/lib/logy";

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV || "";
// //start server
server.listen(port, () => {
  logy("Server started on port -> " + port + " env: " + env);
});
