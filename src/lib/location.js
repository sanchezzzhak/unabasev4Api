const apiLocation = "http://ip-api.com/json/";
import axios from "axios";
export const getLocationByIp = async req => {
  const idx = req.ip.lastIndexOf(":");
  const ip = req.headers["x-forwarded-for"];
  logy("-x--------------------------ip");
  // logy(ip);
  logy(req.headers["x-forwarded-for"]);
  return await axios(apiLocation + ip);
};
