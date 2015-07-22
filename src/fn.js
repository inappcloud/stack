var util = require('util');

function err(fn, e) {
  if (fn.errors[e.message] !== undefined) {
    var newErr = new Error();
    newErr.id = e.message;
    newErr.message = fn.errors[e.message].message;
    newErr.status = fn.errors[e.message].status;
    return newErr;
  } else {
    return e;
  }
}

module.exports = function(fn) {
  return function(args) {
    for (var argName in fn.args) {
      if (fn.args[argName].required === true && args[argName] === undefined) {
        return new Promise(function(resolve, reject) {
          var e = new Error();
          e.id = 'MISSING_ARG';
          e.message = argName + ' argument is required.';
          e.status = 400;
          reject(e);
        });
      }

      if (fn.args[argName].defaultsTo !== undefined) {
        args[argName] = fn.args[argName].defaultsTo;
      }
    }

    return new Promise(function(resolve, reject) {
      function done(v) {
        if (util.isError(v)) {
          reject(err(fn, v));
        } else {
          resolve(v);
        }
      }

      fn.call(args, done);
    });
  };
};
