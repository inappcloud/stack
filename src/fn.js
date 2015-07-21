var util = require('util');

module.exports = function(fn) {
  return function(args) {
    for (var argName in fn.args) {
      if (fn.args[argName].required === true && args[argName] === undefined) {
        return new Promise(function(resolve, reject) {
          var e = new Error();
          e.id = 'MISSING_ARG';
          e.message = argName + ' argument is required.';
          e.code = 400;
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
          reject(v);
        } else {
          resolve(v);
        }
      }

      fn.call(args, done);
    });
  };
};
