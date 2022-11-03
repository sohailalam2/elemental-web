import { Exception } from '@sohailalam2/abu';

export class UnableToRenderElementalComponentException extends Exception {}

export class ElementalComponentIsNotRegisteredException extends Exception {}

export class ElementalComponentIsAlreadyRegistered extends Exception {}

export class ElementalComponentCustomEventHandlerIsNotDefined extends Exception {}

export class InvalidElementalComponentPrefixException extends Exception {}

export class ElementalComponentInvalidComponentIdException extends Exception {}

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegistered extends Exception {}
