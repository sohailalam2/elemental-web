import { beforeEach, describe, expect, it } from 'vitest';
import {
  ElementalComponentId,
  ElementalComponentInvalidComponentIdException,
  ElementalComponentPrefix,
  InvalidElementalComponentPrefixException,
} from '../values';

describe('elemental-component/value-objects', () => {
  describe('ElementalComponentPrefix', () => {
    let validPrefixes: string[];
    let invalidPrefixes: string[];

    beforeEach(() => {
      validPrefixes = ['valid', 'valid-prefix', 'valid-123', 'valid_prefix', 'valid_123'];
      invalidPrefixes = [
        '123',
        '-invalid',
        'invalid-',
        'invalid*',
        '123-invalid',
        'valid-123-prefix',
        'valid-123_prefix',
      ];
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

  describe('ElementalComponentId', () => {
    let validIds: string[];
    let invalidIds: string[];

    beforeEach(() => {
      validIds = ['valid', 'valid-id', 'valid-123', 'valid_id', 'valid_123'];
      invalidIds = ['123', '-invalid', 'invalid-', 'invalid*', '123-invalid', 'valid-123-id', 'valid-123_id'];
    });

    it('should instantiate a new value object with a valid id', () => {
      validIds.forEach(id => {
        const obj = ElementalComponentId.from(id);

        expect(obj).toBeDefined();
        expect(obj.value).toEqual(id);
      });
    });

    it('should fail to instantiate a new value object with an invalid id', () => {
      invalidIds.forEach(id => {
        expect(() => ElementalComponentId.from(id)).throws(ElementalComponentInvalidComponentIdException);
      });
    });
  });
});
