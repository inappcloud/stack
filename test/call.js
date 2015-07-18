var assert = require('assert');
var test = require('mocha').test;
var fn = require('..').fn;

function eq(actual, expected, done) {
  try {
    assert.equal(actual, expected);
    done();
  } catch(e) {
    done(e);
  }
}

function err(msg, done) {
  done(new Error(msg));
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
      done(new Error('value must be a number.'));
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
    err('expecting to not throw an error.', done);
  });
});

test('rejected call', function(done) {
  addOne({ value: 'test' }).then(function() {
    err('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e.message, 'value must be a number.', done);
  });
});

test('required argument', function(done) {
  addOne({}).then(function() {
    err('expecting to throw an error.', done);
  }).catch(function(e) {
    eq(e.message, 'value argument is required.', done);
  });
});

test('defaultsTo value', function(done) {
  addTwo({}).then(function(v) {
    eq(v, 12, done);
  }).catch(function() {
    err('expecting to not throw an error.', done);
  });
});
