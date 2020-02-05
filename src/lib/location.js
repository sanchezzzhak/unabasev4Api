const apiLocation = "http://ip-api.com/json/";
import axios from "axios";
export const getLocationByIp = async req => {
  const idx = req.ip.lastIndexOf(":");
  const ip = req.headers["x-forwarded-for"];
  console.log("---------------------------ip");
  // console.log(ip);
  console.log(req.headers["x-forwarded-for"]);
  return await axios(apiLocation + ip);
};
