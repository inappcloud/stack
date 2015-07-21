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

function invalidArgErr() {
  var e = new Error();
  e.id = 'INVALID_ARG';
  e.message = 'value argument must be a number.';
  e.status = 400;
  return e;
}

function missingArgErr() {
  var e = new Error();
  e.id = 'MISSING_ARG';
  e.message = 'value argument is required.';
  e.code = 400;
  return e;
}

var addOne = fn({
  name: 'addOne',

  args: {
    value: {
      required: true
    }
  },

  call: function(args, done) {
    if (typeof args.value !== 'number') {
      done(invalidArgErr());
    } else {
      done(args.value + 1);
    }
  }
});

var addTwo = fn({
  name: 'addOne',

  args: {
    value: {
      defaultsTo: 10
    }
  },

  call: function(args, done) {
    done(args.value + 2);
  }
});

test('function call', function(done) {
  addOne({ value: 1 }).then(function(v) {
    eq(v, 2, done);
  }).catch(function() {
    fail('expecting to not throw an error.', done);
  });
});

test('rejected call', function(done) {
  addOne({ value: 'test' }).then(function() {
    fail('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e, invalidArgErr(), done);
  });
});

test('required argument', function(done) {
  addOne({}).then(function() {
    fail('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e, missingArgErr(), done);
  });
});

test('defaultsTo value', function(done) {
  addTwo({}).then(function(v) {
    eq(v, 12, done);
  }).catch(function() {
    fail('expecting to not throw an error.', done);
  });
});
