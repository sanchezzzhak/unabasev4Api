export default api => {
  return {
    google: `${api}auth/google`,
    googleNew: `${api}auth/google/create`,
    login: `${api}auth/login`,
    gauth: `${api}auth/gauth`,
    register: `${api}auth/register`
  };
};
