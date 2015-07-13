module.exports = function(functions) {
  var pkg = {};

  functions.forEach(function(fn) {
    pkg[fn.name] = function(ctx, args) {
      for (var argName in fn.args) {
        if (fn.args[argName].required === true && args[argName] === undefined) {
          return new Promise(function(resolve, reject) {
            ctx.error = new Error(argName + 'argument is required.');
            reject(ctx);
          });
        }
      }

      return fn.call(ctx, args);
    };
  });

  return pkg;
};
