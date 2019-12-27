export const queryHelper = (query, options) => {
  // object to return
  let result = {
    options: {},
    query: {}
  };
  // pass options and sort
  result.options = options;
  result.options.sort = {
    createdAt: query.createdAtSort || "desc",
    updatedAt: query.updatedAtSort || "desc"
  };
  // populate from url query
  let populate = "";
  if (query.populate && query.populate !== "") {
    populate = JSON.parse(query.populate);
    delete query.populate;
    result.options.populate.push(...populate);
  }



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