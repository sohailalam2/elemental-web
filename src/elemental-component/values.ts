import { Exception, ValueObject } from '@sohailalam2/abu';

export class InvalidElementalComponentPrefixException extends Exception {}

export class ElementalComponentInvalidComponentIdException extends Exception {}

const VALID_PATTERN = /^[a-zA-Z]+[_-]?[0-9a-zA-Z]*\b$/;

export class ElementalComponentPrefix extends ValueObject {
  validate() {
    super.validate();
    if (!VALID_PATTERN.test(this.value)) {
      throw new InvalidElementalComponentPrefixException(this.value);
    }
  }
}

export class ElementalComponentId extends ValueObject {
  validate() {
    super.validate();
    if (!VALID_PATTERN.test(this.value)) {
      throw new ElementalComponentInvalidComponentIdException(this.value);
    }
  }
}
