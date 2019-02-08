export default api => {
  return {
    /**
     *  GET/  get doc list params: [name(STRING), isActive(boolean), ]
     */
    /**
     *
     *  GET/:id    get doc info
     */
    /**
     *  POST/   register user
     *   params: {
     *    email: String,
     *    password: String,
     *    name: String,  -------not in use
     *
     *   }
     */
    /**
     *  PUT/   update user
     *   params: {
     *    email: String,
     *    password: String,
     *    name: String,  -------not in use
     *
     *   }
     */
    main: `${api}users/`,
    /**
     *  POST/ login user
     *    user or email: string
     *    password: string
     */
    login: `${api}users/login`,
    /**
     *  GET/ find users by
     *    name, username, idNumber or email
     */
    find: `${api}users/find`,
    logout: `${api}users/logout`,
    /**
     *  PUT/ change password
     *   params: [ :id]
     */
    password: `${api}users/password/`,
    business: `${api}users/business/`,
    user: `${api}users/user/`
  };
};
