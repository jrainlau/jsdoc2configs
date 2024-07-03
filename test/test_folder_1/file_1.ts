/**
 * @jsdoc2configs
 * 
 * @author John Doe
 * @desc A description.
 * @see {@link https://example.com}
 * @param {{ name: string }} a - Parameter A.
 * @param {string} [b] - Parameter B.
 * @returns {number} - Return value.
 * @throws {Error} - Throws an error.
 * @type {Object}
 * @typedef {Object} MyType
 * @template T
 * @property {string} prop - A property.
 * @callback MyCallback - My callback.
 * @augments ParentClass - Inherits from parent class.
 * @implements Interface
 * @deprecated Use another function.
 * @class
 * @public
 * @private
 * @protected
 * @readonly
 * @override
 * @enum {number}
 * @this {MyClass}
 */
export function foo(a: string, b: string, c: string): string { return 'foo' }
