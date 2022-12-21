'use strict';

var define = require('define-properties');
var globalThis = require('globalthis')();
var getPolyfill = require('./polyfill');

module.exports = function shimSuppressedError() {
	var polyfill = getPolyfill();
	define(
		globalThis,
		{ SuppressedError: polyfill },
		{
			SuppressedError: function testSuppressedError() {
				return globalThis.SuppressedError !== polyfill;
			}
		}
	);
	return polyfill;
};
