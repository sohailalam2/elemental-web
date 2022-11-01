import { beforeEach, describe, expect, it } from 'vitest';
import { ElementalComponentPrefix, InvalidElementalComponentPrefixException } from './';

describe('elemental-component/value-objects', () => {
  describe('ElementalComponentPrefix', () => {
    let validPrefixes: string[];
    let invalidPrefixes: string[];

    beforeEach(() => {
      validPrefixes = [
        'valid',
        'valid-prefix',
        'valid-123',
        'valid-123-prefix',
        'valid_prefix',
        'valid_123',
        'valid-123_prefix',
      ];
      invalidPrefixes = ['123', '-invalid', 'invalid-', 'invalid*', '123-invalid'];
    });

    it('should instantiate a new value object with a valid prefix', () => {
      validPrefixes.forEach(value => {
        const obj = ElementalComponentPrefix.from(value);

        expect(obj).toBeDefined();
        expect(obj.value).toEqual(value);
      });
    });

    it('should fail to instantiate a new value object with an invalid prefix', () => {
      invalidPrefixes.forEach(value => {
        expect(() => ElementalComponentPrefix.from(value)).throws(InvalidElementalComponentPrefixException);
      });
    });
  });
});
