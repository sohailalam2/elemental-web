# Elemental Component

> Your regular HTMLElement but on steroid 💪

Use the fundamental technologies that you are already familiar with to build for the modern web 😁

## Features

- Create & Register [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- Create & Register an HTML template for the component
- Use the normal DOM or the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- Auto discovery of existing HTML template
- Manage event listeners easily
- Dispatch native
  and [custom events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events)

## Class Signature

```ts
abstract class ElementalComponent<State = string> extends HTMLElement implements EventController {
  // child classes must override the render method
  protected abstract render(): void;
}
```

`ElementalComponent` is an abstract class and all your component classes must extend it to get the Power! 👊
The only hard requirement is to override the `render()` method which should handle how the DOM gets rendered.

It is left upto the developer to decide how they want to render the DOM.

## Elemental Component Options

The `ElementalComponent` `super()` constructor can accept an optional `ElementalComponentOptions`.

```ts
interface ElementalComponentOptions {
  /**
   * Each `ElementalComponent` by defaults gets an internal `state` of type
   * that was declared in the component definition. The state can be access
   * using the `this.$state` property.
   */
  state?: unknown;

  /**
   * An optional `id` for the instance of the custom element.
   * An alphanumeric ID will be auto generated if one is not provided here.
   */
  id?: ElementalComponentId;

  /**
   * By default, an `ElementalComponent` is created with a shadowRoot
   * (enclosed in a shadow DOM). However, this configuration property
   * allows us to create an instance without a shadow DOM.
   */
  noShadow?: boolean;

  /**
   * By default, an `ElementalComponent` is created with a shadow DOM in the
   * 'open' mode. However, this configuration property allows us to create one
   * in a 'closed' mode.
   */
  mode?: ShadowRootMode;

  /**
   * A boolean that, when set to true, specifies behavior that mitigates
   * custom element issues around focusability. When a non-focusable part
   * of the shadow DOM is clicked, the first focusable part is given focus,
   * and the shadow host is given any available :focus styling.
   */
  delegatesFocus?: boolean;

  /**
   * Event Listeners can be auto registered if they are configured here.
   * Read more in the Controller section of the guide.
   */
  eventHandlers?: EventListenerRegistration[];
}
```

## Usage

```ts
import { hasValue } from '@sohailalam2/abu';
import { ElementalComponent } from '@sohailalam2/elemental-web';

export class ButtonCounter extends ElementalComponent<number> {
  protected connectedCallback() {
    super.connectedCallback();
    this.registerEventListeners([{ name: 'click', handler: this.onClick }]);
  }

  // Render the element's HTML content
  protected render() {
    this.$root.innerHTML = `<button>Click Me (${this.$state})</button>`;
  }

  // NOTE: its a regular private method that is being used as an event handler
  private onClick() {
    if (hasValue(this.$state)) {
      const count = this.$state + 1;

      // use this to update the internal state...
      // this is important and this makes the `$state` reactive
      this.updateState(count);

      // dispatch a Custom Event with payload
      this.raiseEvent(
        'button-clicked', // event name
        true, // is a custom event
        `You have clicked my button ${count} times`, // some payload
      );
    }
  }
}

// Dont forget to regiser the component...
// only after this it will be made available for instantiation
ElementalComponent.register(ButtonCounter);
```

## Using complex Value Object as State

[Abu](https://github.com/sohailalam2/abu) provides [Value Object](https://sohailalam2.github.io/abu/data-helpers/value-object/index)
that can be used as the `state` for the component.

The only thing to remember is to provide a custom `deserialie()` implementation.

```ts
class MyValueObjectState extends ValueObject {}

interface ComplexState {
  vo: MyValueObjectState;
}
class ComplexStateVO extends ValueObject<ComplexState> {}

class MyValueObjectStateComponent extends ElementalComponent<ComplexStateVO> {
  protected deserialize(serializedState: string | undefined): ComplexStateVO {
    if (!serializedState) {
      return ComplexStateVO.from({ vo: MyValueObjectState.from('undefined') });
    }

    return ComplexStateVO.deserialize(serializedState, { vo: MyValueObjectState });
  }

  protected render(): void {
    // do nothing
  }
}

const state: ComplexStateVO = ComplexStateVO.from({ vo: MyValueObjectState.from(myComponentState) });

ElementalComponent.register(MyValueObjectStateComponent);
const div = document.createElement('div');
const component = new MyValueObjectStateComponent({ state });

div.appendChild(component);
expect(component.$state).toEqual(state);
```
