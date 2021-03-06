import checkObjectId from "../lib/db/checkObjectId";

const validateParams = function(requestParams, toValidate) {
  return function(req, res, next) {
    for (let param of requestParams) {
      if (checkParamPresent(Object.keys(req[toValidate]), param)) {
        let reqParam = req[toValidate][param.param_key];
        if (!checkParamType(reqParam, param)) {
          return res.send(400, {
            status: 400,
            result: `${param.param_key} is of type ` + `${typeof reqParam} but should be ${param.type}`
          });
        } else {
          if (!runValidators(reqParam, param.validator_functions)) {
            return res.send(400, {
              status: 400,
              result: `Validation failed for ${param.param_key}`
            });
          }
          if (param.enum && !checkEnums(reqParam, param)) {
            return res.send(400, {
              status: 400,
              result: `Validation failed for ${param.param_key} it is not a value allowed`
            });
          }
        }
      } else if (param.required) {
        // return res.send(400, {
        //   status: 400,
        //   result: `Missing Parameter ${param.param_key}`
        // });
        return res.status(400).send({
          status: 400,
          result: `Missing Parameter ${param.param_key}`
        });
      }
    }
    next();
  };
};

const checkEnums = (reqParams, paramObj) => {
  return paramObj.enum?.includes(reqParams);
};

const checkParamPresent = function(reqParams, paramObj) {
  return reqParams.includes(paramObj.param_key);
};

const checkParamType = function(reqParam, paramObj) {
  const reqParamType = Array.isArray(reqParam) ? "array" : typeof reqParam;
  return paramObj.type === "objectid" ? checkObjectId(reqParam) : reqParamType === paramObj.type;
};

const runValidators = function(reqParam, validator_functions = []) {
  for (let validator of validator_functions) {
    if (!validator(reqParam)) {
      return false;
    }
  }
  return true;
};

module.exports = {
  validateParams
};
