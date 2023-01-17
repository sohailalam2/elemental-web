import { Exception, ValueObject, ValueObjectDeserializationMapper } from '@sohailalam2/abu';

import { ElementalComponentState, StateIsNotConsistentException } from '../../../src';

export class InvalidMagicianNameException extends Exception {}

export class InvalidMagicianSuperPowerException extends Exception {}

/**
 * Magician Name value object with validation
 */
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

/**
 * Magician Super Power value object with proper validation
 */
export class MagicianSuperPower extends ValueObject {
  private static readonly AVAILABLE_SUPERPOWERS = ['unknown', 'The Mystic Art'];

  validate() {
    super.validate();

    if (!MagicianSuperPower.AVAILABLE_SUPERPOWERS.includes(this.value)) {
      throw new InvalidMagicianSuperPowerException(this.value);
    }
  }
}

/**
 * The type declaration of the Magician State
 */
export interface MagicianStateData {
  name: MagicianName;
  superpower: MagicianSuperPower;
}

/**
 * The magician State type that must extend ElementalComponentState
 */
export class State extends ElementalComponentState<MagicianStateData> {
  // As this is a complex value object state, we should provide a default value so that the state
  // is never initialized in an inconsistent manner
  //
  // This is a simple but necessary step for complex object type of state
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({
      name: MagicianName.from('unknown '),
      superpower: MagicianSuperPower.from('unknown'),
    }) as K;
  }

  // The state must override this to provide the correct deserialization mapper
  static deserializationMapper(): ValueObjectDeserializationMapper | undefined {
    return {
      name: MagicianName,
      superpower: MagicianSuperPower,
    };
  }

  // optionally we might want to validate the state and its internal properties
  // so that we eliminate the possibilities of the state being inconsistent
  validate() {
    super.validate();
    const isConsistent = !!this.value && !!this.value.name && !!this.value.superpower;

    if (!isConsistent) {
      throw new StateIsNotConsistentException();
    }
  }
}
