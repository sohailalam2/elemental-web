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

::: tip 💁 `this.$template`
If a template is registered or is autodetected by `ElementalComponent` during the
component instantiation, then its content will be made available via the readonly
instance property `$template`.
:::

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

## Example with Inheritance

In this example, we can see that the `HeroSidekick` component not only inherits
most of the functionalities from `Hero` component but also adds its own flavor.

Notice how `Hero` component uses a complex data as `state`.

![Screenshot](docs/assets/example-with-inheritance.png)

### Components Definition (typescript)

```ts
/* eslint-disable no-magic-numbers */
import { deserialize, randomHex, serialize } from '@sohailalam2/abu';
import { ElementalComponent, ElementalComponentPrefix, ElementalComponentRegistry } from '@/elemental-component';

import styles from './styles.css?inline';
import template from './template.html?raw';

interface HeroMessage {
  name: string;
  message: string;
}

class Hero extends ElementalComponent<HeroMessage> {
  // make name and tagline as observables
  // don't forget to also observe changes to the state attribute too
  static get observedAttributes() {
    return ['name', 'tagline', 'state'];
  }

  // declare the properties
  // no need to delcare `state` property as ElementalComponent
  // takes care of that and exposes it as `$state`
  private name = '';

  private tagline = '';

  protected connectedCallback() {
    super.connectedCallback();

    this.registerEventListeners([
      {
        name: 'click',
        handler: this.onButtonClickHandler,
        attachTo: this.$root.querySelector('button') as HTMLButtonElement,
      },
      {
        name: 'UpdateText',
        handler: this.onUpdateTextHandler,
        isCustomEvent: true,
      },
    ]);

    // Remember to update attributes/properties by calling this.setAttribute()
    setTimeout(() => {
      if (!this.name) {
        this.setAttribute('name', 'Cat Woman🐱');
      }
    }, 2000);
  }

  protected render() {
    const style = this.$root.querySelector('style');
    const name = this.$root.querySelector('.name') as HTMLParagraphElement;
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;
    const secret = this.$root.querySelector('.secret') as HTMLParagraphElement;

    if (style) {
      style.textContent = styles;
    }

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state) {
      secret.textContent = `
        ${this.$state.name} send a secret message.
        ${this.$state.message}
      `;
    }
  }

  protected onButtonClickHandler(e: Event) {
    e.preventDefault();

    this.raiseEvent(
      'UpdateText',
      true,
      serialize({
        name: this.name,
        message: `secret code #${randomHex()}`,
      }),
    );
  }

  protected onUpdateTextHandler(e: Event): void {
    const msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg.name !== this.name) {
      this.updateState(msg);
    }
  }
}

class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}

ElementalComponentRegistry.setDefaultPrefix(ElementalComponentPrefix.from('my'));

ElementalComponent.registerTemplate(Hero, template);

ElementalComponent.register(Hero);
ElementalComponent.register(HeroSidekick);
```

### Components Definition (css)

```css
:host {
  margin: 0;
  padding: 0;
  color: black;
  font-weight: 400;
}

button {
  border: none;
  border-radius: 5px;
  padding: 10px 25px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: black;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.sidekick-tagline {
  color: crimson;
  font-size: 1.5rem;
}

.name {
  font-size: 2.5rem;
  font-weight: 800;
}

.tagline {
  font-size: 1.75rem;
}

.secret {
  font-size: 1.2rem;
  color: #888888;
}
```

### Components Template (html)

```html
<style></style>

<section>
  <p class="name"></p>
  <p class="tagline"></p>
  <p class="secret"></p>
  <button>Send Message</button>
</section>
```

### Usage of the above components

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Elemental Web</title>
  </head>
  <body>
    <my-hero id="one" name="Batman🦇" tagline="The protector of Gotham!"> </my-hero>

    <my-hero-sidekick class="flex-item" name="Robin🐦" tagline="I was lost, but now I am found."> </my-hero-sidekick>

    <my-hero-sidekick class="flex-item" tagline="I ❤ Batman"> </my-hero-sidekick>

    <script type="module" src="./src"></script>
  </body>
</html>
```

## Another Example

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

  render() {
    if (!this.$template) {
      this.$root.innerHTML = `<p>No Template Found for Navbar</p>`;
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
