/* eslint-disable no-magic-numbers */
import { deserialize, hasValue, randomHex, serialize, ValueObject } from '@sohailalam2/abu';

import {
  Component,
  EventListener,
  ElementalComponentState,
  StatefulElementalComponent,
  StateIsNotConsistentException,
} from '../../../src';

import styles from './styles.css?inline';
import template from './template.html?raw';

interface HeroMessage {
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

@Component({ template, styles })
export class Hero extends StatefulElementalComponent<State> {
  static get observedAttributes() {
    return ['name', 'tagline', 'state'];
  }

  name = '';

  tagline = '';

  protected render() {
    const name = this.$root.querySelector('.name') as HTMLParagraphElement;
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;
    const secret = this.$root.querySelector('.secret') as HTMLParagraphElement;

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state.value.name !== 'unknown') {
      secret.textContent = `
        ${this.$state.value.name} send a secret message.
        ${this.$state.value.message}
      `;
    }
  }

  @EventListener('click', { attachTo: 'button' })
  protected onButtonClickHandler() {
    this.raiseEvent(
      'UpdateText',
      true,
      serialize({
        name: this.name,
        message: `secret code #${randomHex()}`,
      }),
    );
  }

  @EventListener('UpdateText', { isCustomEvent: true })
  protected onUpdateTextHandler(e: Event): void {
    const msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg.name !== this.name) {
      this.updateState(State.from(msg));
    }
  }

  protected deserialize(serialized: string | undefined): State {
    return State.deserialize<HeroMessage, State>(serialized);
  }
}
