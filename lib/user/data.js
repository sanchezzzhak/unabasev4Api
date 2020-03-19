import rand from "../random";

export default () => {
  return {
    name: {
      first: rand.text(),
      middle: rand.text(),
      last: rand.text(),
      secondLast: rand.text()
    },
    username: rand.text(),
    password: rand.text(),
    idnumber: rand.number(),
    type: "personal",
    phones: {
      default: rand.number()
    },
    emails: {
      default: rand.email()
    },
    scope: {
      type: "personal"
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
