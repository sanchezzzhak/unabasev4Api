import ntype from "normalize-type";

export const parseQuery = ({ query, sortArray, optionsObject, deleteFromQuery }) => {
  let result = {};
  for (let item of deleteFromQuery) {
    result[item.from][item.name] = item.value;
  }
  result.options = {
    ...result.options,
    ...optionsObject
  };
  let options = {};
  let rquery = ntype(query);

  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;

  return {
    sort,
    query,
    options
  };
};
