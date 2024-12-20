export * from './module-a';
export * from './module-b';

export const invalid = () => {
  var codeSmell = 1;
  const missTyped: number = 'string';
  const missTyped2: string = true;
  const belowErr: any = '';

  return codeSmell + missTyped + belowErr;
};
