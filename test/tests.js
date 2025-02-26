'use strict';

var functionsHaveNames = require('functions-have-names')();
var boundFunctionsHaveNames = require('functions-have-names').boundFunctionsHaveNames();
var hasPropertyDescriptors = require('has-property-descriptors')();
var hasSymbols = require('has-symbols/shams')();
var inspect = require('object-inspect');
var semver = require('semver');

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

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/message-method-prop-cast', function (st) {
		/* eslint no-restricted-syntax: 0 */

		var case1 = new SuppressedError(undefined, undefined, 42);
		st.equal(case1.message, '42', 'message is "42"');
		for (var k in case1) { st.fail(k + ' is enumerable'); }

		var case2 = new SuppressedError(undefined, undefined, false);
		st.equal(case2.message, 'false', 'message is "false"');
		for (k in case2) { st.fail(k + ' is enumerable'); }

		var case3 = new SuppressedError(undefined, undefined, true);
		st.equal(case3.message, 'true', 'message is "true"');
		for (k in case3) { st.fail(k + ' is enumerable'); }

		var case4 = new SuppressedError(undefined, undefined, { toString: function () { return 'string'; } });
		st.equal(case4.message, 'string', 'message is "string"');
		for (k in case4) { st.fail(k + ' is enumerable'); }

		var case5 = new SuppressedError(undefined, undefined, null);
		st.equal(case5.message, 'null', 'message is "null"');
		for (k in case5) { st.fail(k + ' is enumerable'); }

		st.end();
	});

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/message-method-prop', function (st) {
		/* eslint no-restricted-syntax: 0 */

		var obj = new SuppressedError(undefined, undefined, '42');
		st.equal(obj.message, '42', 'message is "42"');
		for (var k in obj) { st.fail(k + ' is enumerable'); }

		st.end();
	});

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/message-tostring-abrupt-symbol', { skip: !hasSymbols || !Symbol.toPrimitive }, function (st) {
		var case1 = Symbol();

		st['throws'](function () { return new SuppressedError(undefined, undefined, case1); }, TypeError, 'toPrimitive');

		var case2 = {
			toString: function () {
				throw new EvalError();
			},
			valueOf: function () {
				throw new EvalError();
			}
		};

		case2[Symbol.toPrimitive] = function () {
			return Symbol();
		};

		st['throws'](function () { return new SuppressedError(undefined, undefined, case2); }, TypeError, 'from ToPrimitive');

		st.end();
	});

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/message-tostring-abrupt', function (st) {
		/* eslint no-throw-literal: 0 */

		if (hasSymbols && Symbol.toPrimitive) {
			var case1 = {
				toString: function () {
					throw 'toString called';
				},
				valueOf: function () {
					throw 'valueOf called';
				}
			};
			case1[Symbol.toPrimitive] = function () {
				throw new EvalError();
			};

			st['throws'](function () { return new SuppressedError(undefined, undefined, case1); }, EvalError, 'toPrimitive');
		}

		var case2 = {
			toString: function () {
				throw new EvalError();
			},
			valueOf: function () {
				throw 'valueOf called';
			}
		};

		st['throws'](function () { return new SuppressedError(undefined, undefined, case2); }, EvalError, 'toString');

		var case3 = {
			toString: undefined,
			valueOf: function () {
				throw new EvalError();
			}
		};

		st['throws'](function () { return new SuppressedError(undefined, undefined, case3); }, EvalError, 'valueOf');

		st.end();
	});

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/newtarget-is-undefined', function (st) {
		var obj = SuppressedError();

		st.ok(Object.prototype.isPrototypeOf.call(SuppressedError.prototype, obj));
		st.ok(obj instanceof SuppressedError, 'error is an instanceof SuppressedError');

		st.end();
	});

	t.test(
		'test262: test/built-ins/NativeErrors/SuppressedError/order-of-args-evaluation',
		{ skip: semver.satisfies(process.version, '<= 0.8', { includePrerelease: true }) },
		function (st) {
			var messageStringified = false;
			var message = {
				toString: function () {
					messageStringified = true;
					return '';
				}
			};
			var error = {};
			var suppressed = {};

			var e = new SuppressedError(error, suppressed, message);

			st.equal(messageStringified, true);
			var keys = Object.getOwnPropertyNames(e);
			var indexes = { message: keys.indexOf('message'), error: keys.indexOf('error'), suppressed: keys.indexOf('suppressed') };
			st.ok(indexes.message < indexes.error, 'message -> error: ' + inspect(indexes));
			st.ok(indexes.error < indexes.suppressed, 'error -> suppressed: ' + inspect(indexes));

			st.end();
		}
	);

	t.test('test262: test/built-ins/NativeErrors/SuppressedError/prototype/errors-absent-on-prototype', function (st) {
		st.equal(Object.prototype.hasOwnProperty.call(SuppressedError.prototype, 'error'), false);
		st.equal(Object.prototype.hasOwnProperty.call(SuppressedError.prototype, 'suppressed'), false);

		st.end();
	});
};
