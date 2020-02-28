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
          if (!runValidators(reqParam, param)) {
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
        return res.send(400, {
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
  return reqParamType === paramObj.type;
};

const runValidators = function(reqParam, paramObj) {
  for (let validator of paramObj.validator_functions) {
    if (!validator(reqParam)) {
      return false;
    }
  }
  return true;
};

module.exports = {
  validateParams: validateParams
};
