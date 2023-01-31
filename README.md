# suppressed-error <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

ES Proposal spec-compliant shim for SuppressedError. Invoke its "shim" method to shim `SuppressedError` if it is unavailable or noncompliant.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment, and complies with the [proposed spec](https://tc39.es/proposal-explicit-resource-management/).

Most common usage:
```js
var assert = require('assert');
var SuppressedError = require('suppressed-error');

var suppressedError = new RangeError('hi!');
var cause = new EvalError('oops');
var error = new SuppressedError(cause, suppressedError, 'this is a suppressed error');

assert.equal(error.error, cause); // this is the cause of the suppression
assert.equal(error.suppressed, suppressedError);
assert.equal(error.message, 'this is a suppressed error');

SuppressedError.shim(); // will be a no-op if not needed

assert.ok(new globalThis.SuppressedError(null, '', {}) instanceof SuppressedError);
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/suppressed-error
[npm-version-svg]: https://versionbadg.es/es-shims/SuppressedError.svg
[deps-svg]: https://david-dm.org/es-shims/SuppressedError.svg
[deps-url]: https://david-dm.org/es-shims/SuppressedError
[dev-deps-svg]: https://david-dm.org/es-shims/SuppressedError/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/SuppressedError#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/suppressed-error.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/suppressed-error.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/suppressed-error.svg
[downloads-url]: https://npm-stat.com/charts.html?package=suppressed-error
[codecov-image]: https://codecov.io/gh/es-shims/SuppressedError/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/SuppressedError/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/SuppressedError
[actions-url]: https://github.com/es-shims/SuppressedError/actions
