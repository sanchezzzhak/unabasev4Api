import { getLocationByIp } from "./location";
import Currency from "../models/currency";

export const getCurrencyByLocation = async req => {
  const location = await getLocationByIp(req);
  const countryOrigin = location.data.country ? location.data.country.toLowerCase() : "chile";
  const currency = await Currency.findOne({ countryOrigin }).exec();

  return currency ? currency._id.toString() : null;
};
