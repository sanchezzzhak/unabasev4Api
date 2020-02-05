const apiLocation = "http://ip-api.com/json/";
import axios from "axios";
export const getLocationByIp = async req => {
  const idx = req.ip.lastIndexOf(":");
  const ip = req.ip.substring(idx + 1, req.ip.length);
  return await axios(apiLocation + ip);
};
