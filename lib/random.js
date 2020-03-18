export default {
  email: () =>
    Math.random()
      .toString(36)
      .substring(2, 15) + "@mail.com",
  number: () => Math.floor(Math.random() * (99999999 - 111111111) + 111111111),
  text: () =>
    Math.random()
      .toString(36)
      .substring(2, 15)
};
