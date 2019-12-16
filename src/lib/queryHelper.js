export const queryHelper = (query, options) => {
  let result = {
    options: {
      sort: {}
    },
    query: {}
  };
  result.options.sort.createdAt = query.createdAtSort || options.createdAtSort || "desc";
  result.options.sort.updatedAt = query.updatedAtSort || options.updatedAtSort || "desc";

  result.options.page = query.page || options.page || 1;
  result.options.limit = query.limit || options.limit || 20;

  result.options.populate = options.populate;

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
