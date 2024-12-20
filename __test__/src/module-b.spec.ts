import { describe, expect, it } from 'bun:test';
import { joinObject } from 'src/module-b';

describe('module-b', () => {
	it('joinObject', () => {
		expect(joinObject({ a: 'a' }, { b: 'b' })).toEqual({ a: 'a', b: 'b' });
	});

	it('longer duration', () => {
		const temp = [];
		const length = 1000000;

		for (let i = 0; i < length; i++) {
			temp.push(joinObject({ a: 'a' }, { b: 'b' }));
		}

		expect(temp).toBeArrayOfSize(length);
	});
});
