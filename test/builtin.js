'use strict';

var defineProperties = require('define-properties');
var isEnumerable = Object.prototype.propertyIsEnumerable;

var runTests = require('./tests');

module.exports = function (t) {
	if (typeof SuppressedError === 'undefined') {
		t.fail('SuppressedError does not exist');
		return;
	}
	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(global, 'SuppressedError'), 'SuppressedError is not enumerable');
		et.end();
	});

	runTests(SuppressedError, t);
};
