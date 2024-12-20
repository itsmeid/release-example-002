import { describe, expect, it } from 'bun:test';
import { joinString } from 'src/module-a';

describe('module-a', () => {
	it('joinString', () => {
		expect(joinString('a', 'b')).toBe('ab');
	});

	it('longer duration', () => {
		const temp = [];
		const length = 1000000;

		for (let i = 0; i < length; i++) {
			temp.push(joinString('a', 'b'));
		}

		expect(temp).toBeArrayOfSize(length);
	});
});
