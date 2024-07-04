/**
 * @jsdoc2configs
 *
 * @desc Get the information of a person.
 * @export
 * @param {({ name: string; age: number; gender: 'male' | 'female' })} person - A person.
 * @returns {string} Person Info
 */
export function genPersonInfo(person: { name: string; age: number; gender: 'male' | 'female' }) {
  return `name: ${person.name}; age: ${person.age}; gender: ${person.gender}`
}

/**
 * @jsdoc2configs
 *
 * @desc Clone the information of a person.
 * @export
 * @param {({ name: string; age: number; gender: 'male' | 'female' })} person - A person.
 * @param {number} amount - Amount of clones.
 * @returns {string[]} Person Info list
 */
export function clonePersonInfo(person: { name: string; age: number; gender: 'male' | 'female' }, amount: number) {
  return new Array(amount).fill(person)
}
