var assert = require('assert');
var stack = require('..');
var pkg = require('../src/pkg.js');

describe('calling function', function() {
  var func = {
    name: 'messageToOutput',

    args: {
      message: {
        required: true
      }
    },

    call: function(ctx, args, done, error) {
      if (args.message === 'ok') {
        done('ok');
      } else if (args.message === 'ko') {
        error('ko');
      }
    }
  };

  var p = pkg([func]);

  it('should fail without proper args', function(done) {
    stack({}).then(function(ctx) {
      return p.messageToOutput(ctx, {});
    }).catch(function(ctx) {
      assert(ctx.error, '`err` expected because required message argument is missing.');
      done();
    });
  });

  it('should be resolved', function(done) {
    stack({}).then(function(ctx) {
      return p.messageToOutput(ctx, { message: 'ok', output: 'message' });
    }).then(function(ctx) {
      assert.equal(ctx.message, 'ok');
      done();
    });
  });

  it('should be rejected', function(done) {
    stack({}).then(function(ctx) {
      return p.messageToOutput(ctx, { message: 'ko' });
    }).catch(function(ctx) {
      assert.equal(ctx.error, 'ko');
      done();
    });
  });
});
