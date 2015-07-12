var assert = require('assert');
var stack = require('..');

describe('calling function', function() {
  var func = {
    fn: function(args) {
      return new Promise(function(resolve, reject) {
        resolve('ok');
      });
    }
  };

  it('should resolve', function(done) {
    stack(func).then(function(result) {
      assert(result, 'ok');
      done();
    })
  });
});