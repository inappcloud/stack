var assert = require('assert');
var test = require('mocha').test;
var fn = require('..').fn;

function eq(actual, expected, done) {
  try {
    assert.deepEqual(actual, expected);
    done();
  } catch(e) {
    done(e);
  }
}

function fail(msg, done) {
  done(new Error(msg));
}

function err(func, e) {
  if (func.errors[e.message] !== undefined) {
    var newErr = new Error();
    newErr.id = e.message;
    newErr.message = func.errors[e.message].message;
    newErr.status = func.errors[e.message].status;
    return newErr;
  } else {
    return e;
  }
}

function missingArgErr() {
  var e = new Error();
  e.id = 'missingArg';
  e.message = 'value argument is required.';
  e.status = 400;
  return e;
}

var addOne = {
  name: 'addOne',

  args: {
    value: {
      required: true
    }
  },

  out: {
    example: 4
  },

  errors: {
    invalidArgument: {
      message: 'value argument must be a number.',
      status: 400
    }
  },

  call: function(args, done) {
    if (typeof args.value !== 'number') {
      done(new Error('invalidArgument'));
    } else {
      done(args.value + 1);
    }
  }
};

var addTwo = {
  name: 'addOne',

  args: {
    value: {
      defaultsTo: 10
    }
  },

  call: function(args, done) {
    done(args.value + 2);
  }
};

test('function call', function(done) {
  fn(addOne)({ value: 1 }).then(function(v) {
    eq(v, 2, done);
  }).catch(function() {
    fail('expecting to not throw an error.', done);
  });
});

test('rejected call', function(done) {
  fn(addOne)({ value: 'test' }).then(function() {
    fail('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e, err(addOne, e), done);
  });
});

test('required argument', function(done) {
  fn(addOne)({}).then(function() {
    fail('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e, missingArgErr(), done);
  });
});

test('defaultsTo value', function(done) {
  fn(addTwo)({}).then(function(v) {
    eq(v, 12, done);
  }).catch(function() {
    fail('expecting to not throw an error.', done);
  });
});
