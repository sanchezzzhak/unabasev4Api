import rand from "../lib/random";

export default () => {
  return {
    name: rand.text(),
    username: rand.text(),
    password: rand.text(),
    idnumber: rand.number(),
    type: "business",
    phones: {
      default: rand.number()
    },
    emails: {
      default: rand.email()
    },
    address: {
      street: "carmen covarrubias" + rand.text(),
      number: 32,
      district: "ñuñoa",
      city: "Santiago",
      region: "Metropolitana",
      country: "Chile"
    }
  };
};
