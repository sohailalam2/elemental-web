import { StatefulElementalComponent } from '../../../src';

import { State } from './State';

import styles from './styles.scss?inline';
import template from './template.html?raw';

export class Magician extends StatefulElementalComponent<State> {
  render() {
    this.nameElement.textContent = this.$state.value.name.value;
    this.superpowerElement.textContent = this.$state.value.superpower.value;
  }

  deserialize(serialized: string | undefined): State {
    return State.deserialize(serialized);
  }

  private get nameElement(): HTMLParagraphElement {
    return this.$root.querySelector('p[part=name]') as HTMLParagraphElement;
  }

  private get superpowerElement(): HTMLParagraphElement {
    return this.$root.querySelector('p[part=superpower]') as HTMLParagraphElement;
  }
}

StatefulElementalComponent.register(Magician, { template, styles });
