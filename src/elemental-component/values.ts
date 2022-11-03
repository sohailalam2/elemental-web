import { Exception, ValueObject } from '@sohailalam2/abu';

export class InvalidElementalComponentPrefixException extends Exception {}

export class ElementalComponentInvalidComponentIdException extends Exception {}

export class ElementalComponentPrefix extends ValueObject {
  private static readonly PATTERN = /^[a-zA-Z]{1,10}([_-]?[0-9a-zA-Z]{0,10})\b$/;

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
