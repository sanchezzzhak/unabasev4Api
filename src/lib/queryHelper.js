export const queryHelper = (query, options) => {
  let result = {
    options: {},
    query: {}
  };
  result.options = options;
  result.options.sort = {
    createdAt: query.createdAtSort || "desc",
    updatedAt: query.updatedAtSort || "desc"
  };

  result.options.page = query.page || 1;
  result.options.limit = query.limit || 20;

  delete query.createdAtSort;
  delete query.updatedAtSort;
  delete query.scheduleSort;
  delete query.page;
  delete query.limit;
  result.query = {
    ...query
  };
  return result;
};
