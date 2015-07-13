var assert = require('assert');
var stack = require('..');

describe('calling function', function() {
  var func = {
    name: 'messageToOutput',

    args: {
      message: {
        required: true
      }
    },

    fn: function(args) {
      return new Promise(function(resolve, reject) {
        if (args.message === 'ok') {
          resolve(args.message);
        } else if (args.message === 'ko') {
          reject(args.message);
        }
      });
    }
  };

  var s = stack.create(func);

  it('should fail without proper args', function(done) {
    stack.run(
      s.use('messageToOutput', {})
    ).catch(function(err) {
      assert(err, '`err` expected because required message argument is missing.');
      done();
    });
  });

  it('should be resolved', function(done) {
    stack.run(
      s.use('messageToOutput', { message: 'ok' })
    ).then(function(result) {
      assert.equal(result, 'ok');
      done();
    });
  });

  it('should be rejected', function(done) {
    stack.run(
      s.use('messageToOutput', { message: 'ko' })
    ).catch(function(err) {
      assert.equal(err, 'ko');
      done();
    });
  });
});
