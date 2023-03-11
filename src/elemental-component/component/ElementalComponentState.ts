import { Exception, serialize, ValueObject, ValueObjectDeserializationMapper } from '@sohailalam2/abu';

export class StateIsNotConsistentException extends Exception {}

export class MustOverrideStaticDefaultStateMethodException extends Exception {}

export class ElementalComponentState<T> extends ValueObject<T> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    throw new MustOverrideStaticDefaultStateMethodException(this.prototype?.constructor?.name);
  }

  static deserializationMapper(): ValueObjectDeserializationMapper | undefined {
    return undefined;
  }

  public static deserialize<Type, K extends ValueObject<Type> = ValueObject<Type>>(
    value: string | undefined,
    mapper = this.deserializationMapper(),
  ): K {
    if (!value) {
      return this.defaultState();
    }

    return ValueObject.deserialize<Type, K>(value, mapper);
  }

  public serialize(): string {
    return serialize(this);
  }
}
