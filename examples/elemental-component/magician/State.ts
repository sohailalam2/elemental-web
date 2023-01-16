import { Exception, ValueObject, ValueObjectDeserializationMapper } from '@sohailalam2/abu';

import { ElementalComponentState, StateIsNotConsistentException } from '../../../src';

export class InvalidMagicianNameException extends Exception {}

export class InvalidMagicianSuperPowerException extends Exception {}

export class MagicianName extends ValueObject {
  validate() {
    super.validate();
    const MIN_NAME_LENGTH = 3;
    const MAX_NAME_LENGTH = 32;

    if (this.value.length < MIN_NAME_LENGTH || this.value.length > MAX_NAME_LENGTH) {
      throw new InvalidMagicianNameException(this.value);
    }
  }
}

export class MagicianSuperPower extends ValueObject {
  private static readonly AVAILABLE_SUPERPOWERS = ['unknown', 'The Mystic Art'];

  validate() {
    super.validate();

    if (!MagicianSuperPower.AVAILABLE_SUPERPOWERS.includes(this.value)) {
      throw new InvalidMagicianSuperPowerException(this.value);
    }
  }
}

export interface MagicianStateData {
  name: MagicianName;
  superpower: MagicianSuperPower;
}

export class State extends ElementalComponentState<MagicianStateData> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({
      name: MagicianName.from('unknown '),
      superpower: MagicianSuperPower.from('unknown'),
    }) as K;
  }

  static deserializationMapper(): ValueObjectDeserializationMapper | undefined {
    return {
      name: MagicianName,
      superpower: MagicianSuperPower,
    };
  }

  public ensureStateIsConsistent() {
    const isConsistent = !!this.value && !!this.value.name && !!this.value.superpower;

    if (!isConsistent) {
      throw new StateIsNotConsistentException();
    }
  }
}
