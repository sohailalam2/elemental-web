import { ValueObject } from '@sohailalam2/abu';
import { ElementalComponentInvalidComponentIdException, InvalidElementalComponentPrefixException } from './';

export class ElementalComponentPrefix extends ValueObject {
  private static readonly PATTERN = /^[a-zA-Z]{1,10}([_-]?[0-9a-zA-Z]{0,10}){0,2}\b$/;

  validate() {
    super.validate();
    if (!ElementalComponentPrefix.PATTERN.test(this.value)) {
      throw new InvalidElementalComponentPrefixException(this.value);
    }
  }
}

export class ElementalComponentId extends ValueObject {
  private static readonly PATTERN = /^[a-zA-Z]+[_-]?[0-9a-zA-Z]*\b$/;

  validate() {
    super.validate();
    if (!ElementalComponentId.PATTERN.test(this.value)) {
      throw new ElementalComponentInvalidComponentIdException(this.value);
    }
  }
}
