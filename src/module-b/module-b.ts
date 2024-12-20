/**
 * Function that return combined object `A` and `B`.
 *
 * @template A - The first object type.
 * @template B - The second object type.
 * @param a - The first object value.
 * @param b - The second object value.
 * @returns `object` of `a` and `b` combined.
 *
 */
export const joinObject = <A extends object, B extends object>(a: A, b: B): A & B => {
	return Object.assign(a, b);
};

/**
 * Alias of {@link joinObject}
 */
export const joinObj = joinObject;
