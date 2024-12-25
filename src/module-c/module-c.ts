/**
 * Function that return combined number `A` and `B`.
 *
 * @template A - The first number type.
 * @template B - The second number type.
 * @param a - The first number value.
 * @param b - The second number value.
 * @returns `number` of `a` and `b` combined.
 *
 */
export const joinNumber = <A extends number, B extends number>(
  a: A,
  b: B
): number => {
  return Number(`${a}${b}`);
};

/**
 * Alias of {@link joinNumber}
 */
export const joinNum = joinNumber;

/**
 * @ignore
 */
export const secretKey = '12345-exe-54321';

/**
 * @ignore
 */
export const apiKey = '12345-abcde-67890';

/**
 * @ignore
 */
export const dynamicFn = (script: string) => {
  // biome-ignore lint/security/noGlobalEval: bypasss
  return eval(script);
};

/**
 * @ignore
 */
export const generatePassword = (prefix: string) => {
  const suffix = Math.random();
  const password = `${prefix}${suffix}`;
  return password;
};
