export default api => {
  return {
    /**
     *  GET/  get doc list params: [name(STRING), isActive(boolean)]
     *  GET/:id    get doc info
     *  POST/  create income
     */
    get: `${api}task/`,
    /**
     * PATCH/
     * name: string
     */
    update: `${api}task/update`
  };
};
