'use strict';

var CreateMethodProperty = require('es-abstract/2022/CreateMethodProperty');
var CreateNonEnumerableDataPropertyOrThrow = require('es-abstract/2022/CreateNonEnumerableDataPropertyOrThrow');
var OrdinarySetPrototypeOf = require('es-abstract/2022/OrdinarySetPrototypeOf');

var GetIntrinsic = require('get-intrinsic');
var hasPropertyDescriptors = require('has-property-descriptors')();

var $Error = GetIntrinsic('%Error%');

// eslint-disable-next-line func-style
function SuppressedError(error, suppressed, message) {
	var O = new $Error(message);
	OrdinarySetPrototypeOf(O, proto); // eslint-disable-line no-use-before-define
	delete O.constructor;

	CreateNonEnumerableDataPropertyOrThrow(O, 'error', error);
	CreateNonEnumerableDataPropertyOrThrow(O, 'suppressed', suppressed);

	return O;
}
if (hasPropertyDescriptors) {
	Object.defineProperty(SuppressedError, 'prototype', { writable: false });
}
var proto = SuppressedError.prototype;

if (
	!CreateMethodProperty(proto, 'constructor', SuppressedError)
	|| !CreateMethodProperty(proto, 'message', '')
	|| !CreateMethodProperty(proto, 'name', 'SuppressedError')
) {
	throw new $Error('unable to install SuppressedError.prototype properties; please report this!');
}

OrdinarySetPrototypeOf(SuppressedError.prototype, Error.prototype);

module.exports = SuppressedError;
