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

      return new Promise(function(resolve, reject) {
        function done(output) {
          ctx[args.output] = output;
          resolve(ctx);
        }

        function error(err) {
          ctx.error = err;
          reject(ctx);
        }

        fn.call(args, done, error);
      });
    };
  });

  return pkg;
};
