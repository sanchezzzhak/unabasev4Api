export default api => {
  return {
    /**
     * GET/  get doc list ... query: [name(STRING)]
     * GET/:id    get doc info params [id(ObjectId)]
     * POST/  create doc
     */
    main: `${api}currencies/`,
    /**
     * PUT/
     * name: string
     * decimal: enum[",","."]
     * thousand: enum[",","."]
     * prefix: string,
     * suffix: string,
     * presicion: number, min: 0, max: 10
     */
    update: `${api}currencies/update`,
    /**
     *   GET/
     *   Query  [  query: String ]
     *
     */
    find: `${api}currencies/find`
  };
};
