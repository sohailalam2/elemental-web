import { Component, StatefulElementalComponent } from '../../../src';

import { State } from './State';

import styles from './styles.scss?inline';
import template from './template.html?raw';

@Component({ template, styles })
export class Magician extends StatefulElementalComponent<State> {
  // Since this component uses a complex value object as its state, we need to override deserialize() method to
  // indicate how to properly deserialize the state. It's a fairly simple but necessary step.
  deserialize(serialized: string | undefined): State {
    return State.deserialize(serialized);
  }

  render() {
    const { name, superpower } = this.$state.value;

    this.nameElement.textContent = name.value;
    this.superpowerElement.textContent = superpower.value;
  }

  private get nameElement(): HTMLParagraphElement {
    return this.$root.querySelector('p[part=name]') as HTMLParagraphElement;
  }

  private get superpowerElement(): HTMLParagraphElement {
    return this.$root.querySelector('p[part=superpower]') as HTMLParagraphElement;
  }
}
