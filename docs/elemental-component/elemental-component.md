# Elemental Component

Unleash the full potential of your web development with `ElementalComponent`, the foundation for all your custom components.

With a simple requirement of overriding the `render()` method, you have the flexibility to decide how you want to render your DOM.
Whether you prefer to use the regular DOM or the powerful `shadow` DOM, `ElementalComponent` gives you the freedom to create the perfect user experience.

Once connected, the `render()` method will be called, providing a centralized location for all your DOM rendering needs.
This ensures your code is organized and easy to maintain, while giving you the flexibility to create dynamic and engaging user interfaces. 🚀

## Class Signature

```ts
abstract class ElementalComponent extends HTMLElement implements EventController {
  constructor(private readonly options: ElementalComponentOptions = {}) {
    super();
    // constructor
  }

  // child classes must override the render method
  protected abstract render(): void;

  public raiseEvent(name: string, options?: EventOptions): void;

  public raiseEvent(name: string, isCustom?: boolean, options?: EventOptions): void;

  public raiseEvent<Payload = undefined>(
    name: string,
    isCustom?: boolean,
    payload?: Payload,
    options?: EventOptions,
  ): void;
}
```

## Options

The `ElementalComponent` constructor offers a powerful and flexible way to configure your components.

By passing an optional `ElementalComponentOptions` object to the `super()` constructor, you can customize the behavior of your component, with a range of options to choose from.

| Option         | Type                          | Description                                                                                                                                                                                                                                                                |
| -------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | `ElementalComponentId`        | An optional `id` for the instance of the custom element.<br/> An alphanumeric ID will be auto generated if one is not provided here.                                                                                                                                       |
| noShadow       | `boolean`                     | By default, an `ElementalComponent` is created with a shadowRoot (enclosed in a shadow DOM). However, this configuration property allows us to create an instance without a shadow DOM.                                                                                    |
| mode           | `ShadowRootMode`              | By default, an `ElementalComponent` is created with a shadow DOM in the 'open' mode. However, this configuration property allows us to create one in a 'closed' mode.                                                                                                      |
| delegatesFocus | `boolean`                     | A boolean that, when set to true, specifies behavior that mitigates custom element issues around focusability. When a non-focusable part of the shadow DOM is clicked, the first focusable part is given focus, and the shadow host is given any available :focus styling. |
| eventHandlers  | `EventListenerRegistration[]` | Event Listeners can be auto registered if they are configured here. Read more in the Controller section of the guide.                                                                                                                                                      |

## Example

```html
<!-- template.html -->
<p>This is a regular paragraph, defined as a stateless elemental-component.</p>
```

```ts
// Paragraph.ts
import { ElementalComponent } from '@sohailalam2/elemental-web';

import template from './template.html?raw';

export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do nothing as all we want is to render the template
  }
}

// Dont forget to register the component!!
ElementalComponent.register(Paragraph, { template });

// Simply initialize and use it
document.body.appendChild(new Paragraph());
```
