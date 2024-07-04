/**
 * @jsdoc2configs
 * 
 * @desc Sum of two numbers.
 * @export
 * @param {number} a - Number of one.
 * @param {number} b - Number of another.
 * @returns {number} a + b
 */
export function sum(a: number, b: number) {
   return a + b
}

/**
 * @otherKeyTag
 *
 * @desc This function does not have a jsdoc2configs
 * @export
 * @param {string} info
 * @return {string} 
 */
export function foo(info: string) { return info }

/**
 * @jsdoc2configs
 * 
 * @desc Diff of two numbers.
 * @export
 * @param {number} a - Number of one.
 * @param {number} b - Number of another.
 * @returns {number} a - b
 */
export function diff(a: number, b: number) {
   return a - b
}