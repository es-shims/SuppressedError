'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof SuppressedError === 'function' ? SuppressedError : implementation;
};
