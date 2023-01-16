# Stateful Component Example

![stateful-component-example.png](/assets/elemental-component/stateful-component-example.png)

## template.html

```html
<section>
  <p slot="name" part="name">Magician</p>
  <p slot="superpower" part="superpower">Show Magic</p>
</section>
```

## styles.scss

```scss
:host {
  margin: 0;
  padding: 0;

  // Declare all variables with default values
  --magician-name-color: #155f3e;
  --magician-superpower-color: var(--magician-name-color);
  --magician-font-weight: bold;
  --magician-font-size: 2em;
}

::part(name) {
  font-weight: var(--magician-font-weight);
  font-size: var(--magician-font-size);
  color: var(--magician-name-color);
}

::part(superpower) {
  font-size: calc(0.6 * var(--magician-font-size));
  color: var(--magician-superpower-color);
}
```

## State.ts

```ts
import { Exception, ValueObject, ValueObjectDeserializationMapper } from '@sohailalam2/abu';
import { ElementalComponentState, StateIsNotConsistentException } from '@sohailalam2/elemental-web';

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
```

## Magician.ts

```ts
import { StatefulElementalComponent } from '@sohailalam2/elemental-web';

import { State } from './State';

import styles from './styles.scss?inline';
import template from './template.html?raw';

export class Magician extends StatefulElementalComponent<State> {
  // Since this component uses a complex value object as its state, we need to override the deserialize() method to
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

StatefulElementalComponent.register(Magician, { template, styles });

// create an instance
const magician = new Magician({
  state: State.from<MagicianStateData, State>({
    name: MagicianName.from('Dr. Strange'),
    superpower: MagicianSuperPower.from('The Mystic Art'),
  }),
});

document.body.appendChild(magician);
```
