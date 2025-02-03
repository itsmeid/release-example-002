export * from './module-a';
export * from './module-b';
export const tes = () => {
  // biome-ignore lint/suspicious/noExplicitAny: Bypassed
  type Any = any; // type-coverage:ignore-line

  const arr: Any[] = [];
  const str: string = 1;

  console.log(arr, str);
}
