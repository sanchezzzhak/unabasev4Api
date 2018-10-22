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
     *  POST/   register business
     *   params: {
     *    email: String,
     *    password: String,
     *    name: String,  -------not in use
     *
     *   }
     */
    /**
     *  PUT/   update business
     *   params: {
     *    email: String,
     *    password: String,
     *    name: String,  -------not in use
     *
     *   }
     */
    main: `${api}business/`,
    /**
     *  GET/ find business by
     *    name, username, idnumber or email
     */
    find: `${api}business/find`,
    business: `${api}business/business/`
  };
};
