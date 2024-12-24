import { describe, expect, it } from 'bun:test';
import { joinNumber } from 'src/module-c';

describe('module-c', () => {
  it('joinNumber', () => {
    expect(joinNumber(1, 1)).toBe(11);
  });

  it('longer duration', () => {
    const temp = [];
    const length = 1000000;

    for (let i = 0; i < length; i++) {
      temp.push(joinNumber(1, 1));
    }

    expect(temp).toBeArrayOfSize(length);
  });
});
