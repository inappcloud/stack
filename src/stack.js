module.exports = {
  create: function(fn) {
    var use = function(name, args) {
      return [this.fn[name], args];
    };

    var obj = {};
    obj[fn.name] = fn;

    return { fn: obj, use: use };
  },

  run: function(args) {
    var fn = args[0];
    for (var argName in fn.args) {
      if (fn.args[argName].required === true && args[1][argName] === undefined) {
        return new Promise(function(resolve, reject) { reject(new Error(argName + 'argument is required.')); });
      }
    }

    return args[0].fn(args[1]);
  }
};
