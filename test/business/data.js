import rand from "../lib/random";
export default () => {
  return {
    name: "test business",
    username: rand.text(),
    // password: data.password,
    idNumber: rand.number(),
    type: "business",
    phones: {
      default: rand.number()
    },
    emails: {
      default: rand.email()
    },
    address: {
      street: "carmen covarrubias",
      number: 32,
      district: "ñuñoa",
      city: "Santiago",
      region: "Metropolitana",
      country: "Chile"
    }
  };
};
