var assert = require('assert');
var stack = require('..');

describe('calling function', function() {
  var func = {
    name: 'messageToOutput',

    fn: function(args) {
      return new Promise(function(resolve, reject) {
        if (args.message === 'ok') {
          resolve(args.message);
        } else {
          reject('ko');
        }
      });
    }
  };

  var s = stack.create(func);
  // s.configure({ globalOption: null });

  it('should be resolved', function(done) {
    stack.run(
      s.use('messageToOutput', { message: 'ok' })
    ).then(function(result) {
      assert.equal(result, 'ok');
      done();
    })
  });

  it('should be rejected', function(done) {
    stack.run(
      s.use('messageToOutput', { message: 'ko' })
    ).catch(function(err) {
      assert.equal(err, 'ko');
      done();
    })
  });
});