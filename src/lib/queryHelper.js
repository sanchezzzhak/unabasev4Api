import paginateConfig from "../config/paginate";

export const queryHelper = (query, options, regex = []) => {
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
  try {
    if (query.populate && query.populate !== "") {
      populate = JSON.parse(query.populate);
      delete query.populate;
      result.options.populate.push(...populate);
    }
  } catch (err) {
    console.log(err);
  }

  result.options.page = query.page || paginateConfig.page;
  result.options.limit = query.limit || paginateConfig.limit;

  delete query.createdAtSort;
  delete query.updatedAtSort;
  delete query.scheduleSort;
  delete query.page;
  delete query.limit;

  let regexQuery = {};
  if (regex.length) {
    for (let reg of regex) {
      regexQuery[reg] = { $regex: query[reg], $options: "i" };
      delete query[reg];
    }
  }
  result.query = {
    ...query,
    ...regexQuery
  };
  return result;
};
