# Stateful Component

## ElementalComponentState

`ElementalComponentState` is a class that provides a state management capabilities to `StatefulElementalComponent`.
It can be extended to customize the behavior to your need.

::: danger 👺 Overrides for complex state
It is essential to override the `defaultState()`, `deserializationMapper()`, and `validate()` methods for complex
ValueObjects to ensure the state is correctly handled and is consistent.
:::

### Class Signature

```ts
class ElementalComponentState<T> extends ValueObject<T> {
  // override this to provide a default state
  static defaultState<Type, K extends ValueObject<Type>>(): K {}

  // override this to provide a the deserialization mapper object
  static deserializationMapper(): ValueObjectDeserializationMapper | undefined {}

  // override this to validate and throw `StateIsNotConsistentException`
  // if state is not consistent
  validate() {
    super.validate();
  }

  // generally there is no need to override the deserialize method
  // this can be called from within the component to deserialize the state
  public static deserialize(value: string | undefined): ElementalComponentState<T> {}
}
```

## StatefulElementalComponent

By extending `StatefulElementalComponent`, your component classes will have access to an internal state object,
defined by the type declared in the component definition. Additionally, `StatefulElementalComponent` extends `ElementalComponent`,
providing all the powerful features and capabilities of `ElementalComponent`.

The need to override the `deserialize()` method only arises when the state is a non-primitive, such as a complex value object,
which requires additional steps to deserialize correctly. However, it's quite simple, all you need to do is override the `deserialize()` method of your component class
and call the correct `deserialize()` of the state class that extends `ElementalComponentState`.

### Class Signature

```ts
abstract class StatefulElementalComponent<State extends ElementalComponentState<unknown>> extends ElementalComponent {
  constructor(options: StatefulElementalComponentOptions = {}) {
    super(options);
    // constructor
  }

  // child classes must override the render method
  protected abstract render(): void;

  // Override deserialize() to provide the correct state deserialization
  protected deserialize(serialized: string | undefined): State {}

  // Update the state by calling this method...
  // This internally calls the `this.setAttribute()` which is essential to trigger the attribute change lifecycle
  public updateState(value: State) {}
}
```

## StatefulElementalComponentOptions

The constructor offers a configuration option by accepting an optional `StatefulElementalComponentOptions` object,
which builds upon the options provided by `ElementalComponentOptions` and offers additional options for state management.

| Option | Type                               | Description                                                                                                                                                                                                                                                                    |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| state  | `ElementalComponentState<unknown>` | `StatefulElementalComponent` comes equipped with an internal state, defined by the type declared in the component definition. The state can be easily accessed and managed through the `this.$state` property, making it simple to build dynamic and engaging user interfaces. |

## Example

The following example demonstrates a number of interesting concepts:

- State properties are defined as immutable Value Objects with custom validation
- A stateful component should override the deserialization() method to provide correct deserialization support
- The custom element can be registered together with its template and styles
- The template shows `template parts` which can be used to provide theme support
- The styles show the usage of `::part` pseudo-element. Read more [here](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)

![stateful-component-example.png](/assets/elemental-component/stateful-component-example.png)

### Usage

```ts
const magician = new Magician({
  state: State.from<MagicianStateData, State>({
    name: MagicianName.from('Dr. Strange'),
    superpower: MagicianSuperPower.from('The Mystic Art'),
  }),
});

document.body.appendChild(magician);
```

### Component

```ts
// Magician.ts

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
```

### State

```ts
// State.ts

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

    if (!this.AVAILABLE_SUPERPOWERS.includes(this.value)) {
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

### Template

```html
<!-- template.html -->

<section>
  <p slot="name" part="name">Magician</p>
  <p slot="superpower" part="superpower">Show Magic</p>
</section>
```

### Styles

```scss
// styles.scss

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
