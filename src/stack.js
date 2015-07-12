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
    return args[0].fn(args[1]);
  }
};