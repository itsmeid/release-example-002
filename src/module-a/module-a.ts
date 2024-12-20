/**
 * Function that return combined string `A` and `B`.
 *
 * @template A - The first characters type.
 * @template B - The second characters type.
 * @param a - The first characters value.
 * @param b - The second characters value.
 * @returns `string` of `a` and `b` combined.
 *
 */
export const joinString = <A extends string, B extends string>(a: A, b: B): `${A}${B}` => {
	return `${a}${b}`;
};

/**
 * Alias of {@link joinString}
 */
export const joinStr = joinString;
