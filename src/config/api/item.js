export default api => {
  return {
    /**
     * GET/  get doc list ... query: [name(STRING)]
     * GET/:id    get doc info params [id(ObjectId)]
     * POST/  create item
     */
    main: `${api}items/`,
    /**
     *   GET/
     *   Query  [  query: String ]
     *
     */
    find: `${api}items/find`
  };
};
