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

The `ElementalComponent` `super()` constructor can accept an optional `ElementalComponentOptions`.

```ts
interface ElementalComponentOptions {
  /**
   * Each `ElementalComponent` by defaults gets an internal `state` of type that
   * was declared in the component definition. The state can be access using the
   * `this.$state` property.
   */
  state?: unknown;

  /**
   * An optional `id` for the instance of the custom element.
   * An alphanumeric ID will be auto generated if one is not provided here.
   */
  id?: ElementalComponentId;

  /**
   * By default, an `ElementalComponent` is created with a shadowRoot
   * (enclosed in a shadow DOM). However, this configuration property allows us
   * to create an instance without a shadow DOM.
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

## Register a Component

All custom elements MUST be registered before they can be instantiated, not doing so will result in an
`ElementalComponentIsNotRegisteredException` exception.

::: warning 👺 Register Your Component
Register your components before you use. Register them even if you only declare them in HTML pages.
:::

> Read more about [component registration here](./registry/index.md#register-a-component).

### Usage

#### Registering with default prefix `el`

```ts
// Here ButtonCounter gets registered as `el-button-counter`
// and ready for use as <el-button-counter></el-button-counter>
ElementalComponent.register(ButtonCounter);
```

#### Registering with custom prefix

```ts
// Here ButtonCounter gets registered as `awesome-button-counter`
// and ready for use as <awesome-button-counter></awesome-button-counter>
ElementalComponent.register(ButtonCounter, {
  prefix: ElementalComponentPrefix.from('awesome'),
});
```

#### Configure a default custom prefix

By default, ElementalComponent uses `el` as the default prefix. You can optionally change this to
your liking as shows below. Once the default prefix is changed, any further components being registered
will use the new default prefix without you having to explicitly pass it during the registration process.

```ts
ElementalComponentRegistry.setDefaultPrefix(ElementalComponentPrefix.from('my'));
```

## Template Registration

> Read more about [template registration here](./registry/index.md#register-a-template).

### Usage

#### Registering with default prefix `el`

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `el-button-counter`. You can see that in the beginning
// of the document body as `<template id="el-button-counter">...</template>`
ElementalComponent.registerTemplate(ButtonCounter, `<button>Click Me</button>`);
```

#### Registering with custom prefix

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `awesome-button-counter`. You can see that in the beginning
// of the document body as `<template id="awesome-button-counter">...</template>`
ElementalComponent.registerTemplate(
  ButtonCounter,
  `<button>Click Me</button>`,
  ElementalComponentPrefix.from('awesome'),
);
```

#### Registering a component and a template together

```ts
const template = `<button>MyButton</button>`;

ElementalComponent.register(ButtonCounter, { template });
```

::: tip 💁 `this.$template`
If a template is registered or is autodetected by `ElementalComponent` during the
component instantiation, then its content will be made available via the readonly
instance property `$template`.
:::

#### Link a different template

Let's say we already have a template registered in the DOM with an id of `custom-template`.
If we choose to create an element that uses this existing template instead of creating (or registering)
a new template, then we can simply pass the `templateId` during the instantiation of
the component and at runtime, the component will use the given template.

If no such template is found, an `ElementalComponentNoSuchTemplateFoundException` will be thrown.

::: warning It's a reference not a copy
If a `templateId` is provided and a template with such an id already exists, then the
component will try to directly use the content of the given template instead of copying and creating
its own template first.
:::

```ts
const template = `<button>MyButton</button>`;

ElementalComponent.register(ButtonCounter);

const myButton = new ButtonCounter({ templateId: custom - template });
```

## Instantiate a Component

An `ElementalComponent` once registered is ready for use and can be instantiated in two ways:

- By using it as an HTML tag in a document
- By programmatically for instance by using `document.createElement()` API

### Instantiate using its Tag Name

The below example will instantiate a new `ButtonCounter` with its initial `state` set to the value `0`.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app">
      <el-button-counter state="0"></el-button-counter>
    </div>
    <script type="module" src="/src"></script>
  </body>
</html>
```

### Instantiate Programmatically

### Usage

```ts
class MyComponent extends ElementalComponent {
  constructor() {
    super({ state: 'Hello World', mode: 'closed' });
  }

  render(): string {
    if (!this.$template) {
      this.$root.innerHTML = `<p>${this.$state}</p>`;
      return;
    }

    // If a template was registered then do this
    const p = this.$root.querySelector('p');

    if (p) {
      p.textContent = this.$state;
    }
  }
}

ElementalComponent.register(MyComponent);

// ...
// Somewhere else in the code...
// ...

const component = new MyComponent();

document.body.appendChild(component);
```

::: tip 💁 `this.$root`
Every instance of an `ElementalComponent` can have direct access to its DOM root using
the `this.$root` readonly instance property.
:::

### Attributes and Properties

When a new attribute is added to the component, ElementalComponent automatically exposes the attribute
as a class property and if that attribute is made observable, then the attribute and property will
be kept in sync.

#### Example

In the following example, note that there are three attributes used in the HTML code.
`id`, `name`, and `superpower`. Only `superpower` attribute is made an observable.

When the `superpower` attribute change is detected, the corresponding class property `this.superpower`
also gets updated.

```html
<!-- somewhere in index.html -->

<el-hero id="one" name="Superman" superpower="Laser Eyes"></el-hero>
```

```ts
class Hero extends ElementalComponent {
  // IMPORTANT!
  // This is the way to make attributes observable
  static get observedAttributes() {
    return ['superpower'];
  }

  private name = 'Unknown';

  private superpower = 'Unknown';

  protected render() {
    this.$root.innerHTML = `<p>I am ${this.name} and I have ${this.superpower}</p>`;
  }

  protected connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      // IMPORTANT!
      // The only way how an attribute change is fired, is when we call the setAttribute method
      this.setAttribute('superpower', 'XRay Vision');

      // NWRONG WAY!!
      // This will NOT fire a change event hence the DOM will not be refreshed and
      // the attribute will not be in sync with the property value
      this.superpower = 'Super Hearing';
    }, 2000);
  }
}
```

## Lifecycle Hooks

### connectedCallback()

Invoked when the custom element is first connected to the document's DOM.

The abstract class `ElementalComponent` by defaults registers all event listeners in this callback hook.

It is important that we register event listeners here, and unregister them in the disconnected callback.

```ts
class MyComponent extends ElementalComponent {
  protected connectedCallback() {
    super.connectedCallback();
  }
}
```

The abstract class `ElementalComponent` by defaults automatically unregisters all event listeners in this callback hook.

It is important that we register event listeners in the connected callback, and unregister them here.

### disconnectedCallback()

Invoked when the custom element is disconnected from the document's DOM.

```ts
class MyComponent extends ElementalComponent {
  protected disconnectedCallback() {
    super.disconnectedCallback();
  }
}
```

### adoptedCallback()

Invoked when the custom element is moved to a new document.

```ts
class MyComponent extends ElementalComponent {
  protected adoptedCallback() {
    super.adoptedCallback();
  }
}
```

### attributeChangedCallback()

Invoked when one of the custom element's attributes is added, removed, or changed.

The abstract class `ElementalComponent` manages an elaborate set of functionalities
during this lifecycle hook, including the triggering of re-rendering of the component's DOM tree.

::: danger 👺 Call `super.attributeChangedCallback(...)`
If you do decide to override this method in your child class,
do not forget to call the super method.
:::

```ts
class MyComponent extends ElementalComponent {
  protected attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
  }
}
```

## Register Event Listeners

Registration of event listeners can be done using two ways:

### Call `this.registerEventListeners(...)` from `connectedCallback()`

```ts
class ButtonCounter extends ElementalComponent {
  connectedCallback() {
    // ⚠️ Do not forget to call super method
    super.connectedCallback();

    // 👇 register listeners like so
    this.registerEventListeners([{ name: 'click', handler: this.onClick }]);
  }

  render() {
    this.$root.innerHTML = `<button>Click Me</button>`;
  }

  onClick() {
    // do something
  }
}
```

### Auto register by passing configurations in `super()` controller

```ts
class ButtonCounter extends ElementalComponent {
  constructor() {
    // 👇 register listeners like so
    super({ eventHandlers: [{ name: 'custom-event', handlerName: 'onClick', isCustom: true }] });
  }

  render() {
    this.$root.innerHTML = `<button>Click Me</button>`;
  }

  // 👇 The name must match
  onClick() {
    // do something
  }
}
```

## Deregister Event Listeners

`ElementalComponent` will automatically deregister all event listeners once the component is unmounted
and the `disconnectedCallback()` is invoked.

## Raise Events

You can raise events from the component as follows:

```ts
// raise a CustomEvent named `button-clicked` and with a string payload
this.raiseEvent(
  'button-clicked', // event name
  true, // isCustomEvent
  `You have clicked my button ${count} times`, // payload
);
```
