var assert = require('assert');
var stack = require('..');

describe('calling function', function() {
  var func = {
    name: 'messageToOutput',

    fn: function(args) {
      return new Promise(function(resolve, reject) {
        resolve(args.message);
      });
    }
  };

  var s = stack.create(func);

  it('should resolve', function(done) {
    // s.configure({ globalOption: null });
    
    stack.run(
      s.use('messageToOutput', { message: 'ok' })
    ).then(function(result) {
      assert(result, 'ok');
      done();
    })
  });
});