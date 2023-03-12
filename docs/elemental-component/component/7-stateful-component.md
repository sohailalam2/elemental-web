# Stateful Component

## ElementalComponentState

`ElementalComponentState` is a class that provides a state management capabilities to `StatefulElementalComponent`.
The states are represented as [ValueObjects](https://abu.sohailalam.in/data-helpers/value-object/index).

### Example

```ts
import { hasValue, ValueObject } from '@sohailalam2/abu';
import { ElementalComponentState, StateIsNotConsistentException } from '@sohailalam2/elemental-web';

export interface HeroMessage {
  name: string;
  message: string;
}

export class State extends ElementalComponentState<HeroMessage> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({ name: 'unknown', message: 'unknown' }) as K;
  }

  validate() {
    super.validate();
    const isConsistent = hasValue(this.value) && hasValue(this.value.name) && hasValue(this.value.message);

    if (!isConsistent) {
      throw new StateIsNotConsistentException(this.constructor.name);
    }
  }
}
```

### Class Signature

```ts
export class ElementalComponentState<T> extends ValueObject<T> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {}

  static deserializationMapper(): ValueObjectDeserializationMapper | undefined {}

  public static deserialize<Type, K extends ValueObject<Type> = ValueObject<Type>>(
    value: string | undefined,
    mapper = this.deserializationMapper(),
  ): K {}
}
```

::: warning 👺 Overrides for complex state
It is essential to override the `defaultState()`, `deserializationMapper()`, and `validate()` methods for complex
ValueObjects to ensure the state is correctly handled and is consistent.
:::

## StatefulElementalComponent

By extending `StatefulElementalComponent`, your component classes will have access to an internal state object,
defined by the type declared in the component definition. Additionally, `StatefulElementalComponent` extends `ElementalComponent`,
providing all the powerful features and capabilities of `ElementalComponent`.

The need to override the `deserialize()` method only arises when the state is a non-primitive, such as a complex value object,
which requires additional steps to deserialize correctly. However, it's quite simple, all you need to do is override the `deserialize()` method of your component class
and call the correct `deserialize()` of the state class that extends `ElementalComponentState`.

### Example

```ts
import { Component, ObservedState, StatefulElementalComponent } from '@sohailalam2/elemental-web';

import { HeroMessage, State } from './State';

@Component()
export class Hero extends StatefulElementalComponent<State> {
  protected render() {}

  protected deserialize(serialized: string | undefined): State {
    return State.deserialize<HeroMessage, State>(serialized);
  }
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

[![stateful-component-example.png](/assets/elemental-component/stateful-component-example.png)](../examples/2-stateful-component.md)

Check the [Stateful Component code example](../examples/2-stateful-component.md) for more details
