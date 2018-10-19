export default api => {
  return {
    google: `${api}auth/google`,
    // google: {
    //   login: `${api}auth/google/login`,
    //   register: `${api}auth/google/register`
    // },
    // googleNew: `${api}auth/google/register`,
    login: `${api}auth/login`,
    // gauth: `${api}auth/google/login`,
    register: `${api}auth/register`
  };
};
