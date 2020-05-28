import server from "./server";
import logy from "./config/lib/logy";




const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV || "";
// //start server
server.listen(port, () => {
  logy("Server started on port -> " + port + " env: " + env);
});
