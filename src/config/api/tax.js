export default api => {
  return {
    /**
     * GET/  get doc list ... query: [name(STRING)]
     * GET/:id    get doc info params [id(ObjectId)]
     * POST/  create item
     */
    get: `${api}taxs/`,
    /**
     * PATCH/
     * name: string
     */
    update: `${api}taxs/update`
  };
};
