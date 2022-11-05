import { beforeEach, describe, expect, it } from 'vitest';
import {
  ElementalComponentId,
  ElementalComponentInvalidComponentIdException,
  ElementalComponentPrefix,
  InvalidElementalComponentPrefixException,
} from '../values';

describe('elemental-component/value-objects', () => {
  let validValues: string[];
  let inValidValues: string[];

  beforeEach(() => {
    validValues = ['valid', 'valid-value', 'valid-123', 'valid_value', 'valid_123'];
    inValidValues = ['123', '-invalid', 'invalid-', 'invalid*', '123-invalid', 'valid-123-value', 'valid-123_value'];
  });

  describe('ElementalComponentPrefix', () => {
    it('should instantiate a new value object with a valid prefix', () => {
      validValues.forEach(value => {
        const obj = ElementalComponentPrefix.from(value);

        expect(obj).toBeDefined();
        expect(obj.value).toEqual(value);
      });
    });

    it('should fail to instantiate a new value object with an invalid prefix', () => {
      inValidValues.forEach(value => {
        expect(() => ElementalComponentPrefix.from(value)).throws(InvalidElementalComponentPrefixException);
      });
    });
  });

  describe('ElementalComponentId', () => {
    it('should instantiate a new value object with a valid id', () => {
      validValues.forEach(id => {
        const obj = ElementalComponentId.from(id);

        expect(obj).toBeDefined();
        expect(obj.value).toEqual(id);
      });
    });

    it('should fail to instantiate a new value object with an invalid id', () => {
      inValidValues.forEach(id => {
        expect(() => ElementalComponentId.from(id)).throws(ElementalComponentInvalidComponentIdException);
      });
    });
  });
});
