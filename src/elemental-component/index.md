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
  protected abstract render(): string;
}
```

`ElementalComponent` is an abstract class and all your component classes must extend it to get the Power! 👊
The only hard requirement is to override the `render()` method that should return a non-empty string, ideally
some HTML tags that gets rendered on the DOM.

## Usage

```ts
import { hasValue } from '@sohailalam2/abu';
import { ElementalComponent } from '@sohailalam2/elemental-web';

export class ButtonCounter extends ElementalComponent<number> {
  connectedCallback() {
    super.connectedCallback();
    this.registerEventListeners([{ name: 'click', handler: this.onClick }]);
  }

  // Render the element's HTML content
  render() {
    return `<button>Click Me (${this.$state})</button>`;
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

  /**
   * Elemental Web uses `sanitize-html` to sanitize the produced html before
   * rendering it to DOM. One can optionally override it using this option
   *
   * @param html The dirty html
   * @param options Any configuration options passed to the sanitizer
   * @return the sanitized html
   * @link https://github.com/apostrophecms/sanitize-html
   */
  sanitizer?: (html: string, options: unknown) => string;
  sanitizerOptions?: unknown;
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

::: tip 💁 `this.$template`
If a template is registered or is autodetected by `ElementalComponent` during the
component instantiation, then its content will be made available via the readonly
instance property `$template`.
:::

## Instantiate a Component

An `ElementalComponent` once registered is ready for use and can be instantiated in two ways:

- By using it as an HTML tag in a document
- By programmatically by using `document.createElement()` API

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
    // If a template was registered
    if (this.$template) {
      const p = this.$root.querySelector('p');

      if (p) {
        p.textContent = this.$state;
      }

      return this.$root.innerHTML;
    }

    // else render the following
    return `<p>${this.$state}</p>`;
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
    return `<button>Click Me</button>`;
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
    return `<button>Click Me</button>`;
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

```ts
// raise a CustomEvent named `button-clicked` and with a string payload
this.raiseEvent('button-clicked', true, `You have clicked my button ${count} times`);
```

## Full Example

The following is a full example showcasing how to use ElementalComponent and its various features

The example uses the following technologies to make life easier, but of course `ElementalComponent` can be used without
any of these

- [Abu](https://sohailalam2.github.io/abu/) for some helpers such as creation of `ValueObject`
- [Vite](https://vitejs.dev) as a build tool... create a project with typescript support
- [Bulma CSS](https://bulma.io) for some nice css effects
- Support for Typescript
- Support for SCSS / CSS

```html
<!-- template.html -->

<style media="screen"></style>
<nav class="navbar is-info is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://github.com/sohailalam2/elemental-web">
      <img src="/src/assets/img/logo.png" alt="brand logo" />
    </a>
    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="main-navbar">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div id="main-navbar" class="navbar-menu">
    <div class="navbar-start"></div>
    <div class="navbar-end"></div>
  </div>
</nav>
```

```scss
// styles.scss

@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/utilities/initial-variables';
@import 'bulma/sass/base/minireset';
@import 'bulma/sass/components/navbar';

a {
  text-decoration: none;
}
```

```ts
// Navbar.ts

import { Exception, ValueObject, toKebabCase, randomId } from '@sohailalam2/abu';
import { ElementalComponent } from '@sohailalam2/elemental-web';

import styles from './styles.scss?inline';
import template from './template.html?raw';

export class NavbarItemDataCanNotBeThisLarge extends Exception {}

export class NavbarItemData extends ValueObject {
  validate() {
    super.validate();
    const MAX_LENGTH = 15;

    if (this.value.length > MAX_LENGTH) {
      throw new NavbarItemDataCanNotBeThisLarge();
    }
  }
}

export interface NavBarMenu {
  start: NavbarItemData[];
  end: NavbarItemData[];
}

export class NavbarTemplateIsInvalidException extends Exception {}

export class Navbar extends ElementalComponent<NavBarMenu> {
  connectedCallback() {
    super.connectedCallback();
    // attach click handler to all navbar items individually
    this.$root.querySelectorAll('.navbar-item').forEach((el: HTMLElement) => {
      // 💡 Note how we are registering click hander for the anchor
      // element and NOT to the Navbar custom element
      this.registerEventListeners([
        {
          name: 'click',
          handler: this.onItemClickHandler,
          attachTo: el,
        },
      ]);
    });
  }

  render(): string {
    if (!this.$template) {
      return `<p>No Template Found for Navbar</p>`;
    }

    const style = this.$root.querySelector('style');
    const start = this.$root.querySelector('.navbar-start');
    const end = this.$root.querySelector('.navbar-end');

    if (!style || !start || !end) {
      throw new NavbarTemplateIsInvalidException();
    }
    style.textContent = styles;

    (this.$state?.start ?? []).forEach(menu => this.appendItem(menu, start));
    (this.$state?.end ?? []).forEach(menu => this.appendItem(menu, end));

    return this.$root.innerHTML;
  }

  private appendItem(item: NavbarItemData, position: Element) {
    const a = document.createElement('a');

    a.id = randomId();
    a.className = 'navbar-item';
    a.textContent = item.value;
    a.href = toKebabCase(item.value);

    position.appendChild(a);
  }

  private onItemClickHandler(e: Event): void {
    e.preventDefault();
    alert((e.target as HTMLAnchorElement).href);
  }
}

ElementalComponent.register(Navbar);
ElementalComponent.registerTemplate(Navbar, template);
```

```ts
// index.ts

import { NavbarItemData, Navbar, NavBarMenu } from './Navbar';

const menu: NavBarMenu = {
  start: [NavbarItemData.from('Batman'), NavbarItemData.from('Spiderman'), NavbarItemData.from('Superman')],
  end: [NavbarItemData.from('Shaktiman')],
};

export const navbar = new Navbar({ state: menu });

//👌 add the custom element to the document body to render
document.body.prepend(navbar);
```
