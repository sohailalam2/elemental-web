import { hasValue, ValueObject } from '@sohailalam2/abu';
import { ElementalComponentState, StateIsNotConsistentException } from '../../../src';

export interface HeroMessage {
  name: string;
  message: string;
}

export class State extends ElementalComponentState<HeroMessage> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({
      name: 'unknown',
      message: 'unknown',
    }) as K;
  }

  validate() {
    super.validate();
    const isConsistent = hasValue(this.value) && hasValue(this.value.name) && hasValue(this.value.message);

    if (!isConsistent) {
      throw new StateIsNotConsistentException(this.constructor.name);
    }
  }
}
