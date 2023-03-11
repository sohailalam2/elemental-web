/* eslint-disable no-magic-numbers */
import { deserialize, randomHex, serialize } from '@sohailalam2/abu';

import { Component, EventListener, ObservedState, StatefulElementalComponent } from '../../../src';

import styles from './styles.css?inline';
import template from './template.html?raw';
import { HeroMessage, State } from './State';

@Component({ template, styles })
export class Hero extends StatefulElementalComponent<State> {
  @ObservedState
  name = '';

  @ObservedState
  tagline = '';

  protected render() {
    const name = this.$('.name');
    const tagline = this.$('.tagline');
    const secret = this.$('.secret');

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state.value.name !== 'unknown') {
      secret.textContent = `${this.$state.value.name} | ${this.$state.value.message}`;
    }
  }

  @EventListener('click', { attachTo: 'button' })
  protected onButtonClickHandler() {
    const serializedMsg = serialize({ name: this.name, message: `secret code #${randomHex()}` });

    this.raiseEvent('UpdateText', true, serializedMsg);
  }

  @EventListener('UpdateText', { isCustomEvent: true })
  protected onUpdateTextHandler(e: Event): void {
    let msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg) {
      if (msg.name === this.name) {
        msg = { name: this.name, message: '✅ Message Sent' };
      }
      this.updateState(State.from(msg));
    }
  }

  protected deserialize(serialized: string | undefined): State {
    return State.deserialize<HeroMessage, State>(serialized);
  }
}
