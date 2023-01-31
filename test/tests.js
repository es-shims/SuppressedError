'use strict';

var functionsHaveNames = require('functions-have-names')();
var boundFunctionsHaveNames = require('functions-have-names').boundFunctionsHaveNames();
var hasPropertyDescriptors = require('has-property-descriptors')();

module.exports = function (SuppressedError, t) {
	t.test('constructor', function (st) {
		st.equal(typeof SuppressedError, 'function', 'is a function');

		st.equal(SuppressedError.length, 3, 'SuppressedError has a length of 3');

		st.test('Function name', { skip: !functionsHaveNames || !boundFunctionsHaveNames }, function (s2t) {
			s2t.equal(SuppressedError.name, 'SuppressedError', 'SuppressedError has name "SuppressedError"');
			s2t.end();
		});

		if (hasPropertyDescriptors) {
			st.deepEqual(
				Object.getOwnPropertyDescriptor(SuppressedError, 'prototype'),
				{
					configurable: false,
					enumerable: false,
					value: SuppressedError.prototype,
					writable: false
				}
			);
		}

		st.end();
	});

	t.equal(SuppressedError.prototype.message, '', '"message" is an empty string on the prototype');

	t.test('instance', function (st) {
		var one = new TypeError('one!');
		var two = new EvalError('two!');
		var message = 'i am a suppresset error';
		var error = new SuppressedError(one, two, message);

		st.equal(error instanceof SuppressedError, true, 'error is an instanceof SuppressedError');
		st.equal(error instanceof Error, true, 'error is an instanceof Error');

		st.equal(error.message, message, 'error.message is expected');

		st.equal(error.error, one, 'error.error is provided cause');
		st.equal(error.suppressed, two, 'error.suppressed is provided suppressed error');

		st.end();
	});

	t.test('as a function', function (st) {
		var one = new TypeError('one!');
		var two = new EvalError('two!');
		var message = 'i am a suppresset error';
		var error = SuppressedError(one, two, message);

		st.equal(error instanceof SuppressedError, true, 'error is an instanceof SuppressedError');
		st.equal(error instanceof Error, true, 'error is an instanceof Error');

		st.equal(error.message, message, 'error.message is expected');

		st.equal(error.error, one, 'error.error is provided cause');
		st.equal(error.suppressed, two, 'error.suppressed is provided suppressed error');

		st.end();
	});
};
