export default api => {
  return {
    /**
     * GET/  get doc list ... query: [name(STRING), isActive(boolean)]
     * GET/:id    get doc info
     * POST/  create income
     */
    get: `${api}business/`,
    /**
     * PATCH/
     * name: string
     */
    update: `${api}business/update`
  };
};
