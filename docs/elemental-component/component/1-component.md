# ElementalComponent

Imagine you're a web developer, trying to build a snazzy new component for your latest project. You're excited to dive in,
but you quickly realize that you need to learn a whole new domain specific language (DSL) just to make this thing work with a library that your friends have been talking about.
Ugh, really? You've got enough on your plate already!

Enter `ElementalComponent`, the superhero of [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).
With ElementalComponent, you don't have to learn any new language - you can just use the native DOM APIs that you already know and love.
That's right, no new syntax to memorize, no new paradigms to wrap your head around. Just pure, unadulterated HTML, CSS, and JavaScript.

But wait, there's more! `ElementalComponent` comes loaded with all sorts of goodies to make your life easier.
Think of it as a Swiss Army Knife for web components. You get all the standard life-cycle hooks like `connectedCallback()`,
but you also get some extra APIs, Decorators that will save you time and headache. Who doesn't love a good time saver?

The only thing `ElementalComponent` asks of you is to override the `render()` method. That's it! From there,
you can let your creativity run wild and build the component of your dreams. Whether you want to keep it simple or get fancy with it,
the power is in your hands.

## ✍️ Basic Usage

```ts
import { Component, ElementalComponent } from '@sohailalam2/elemental-web';

@Component()
export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do something with the dom
  }
}
```

## ⚙️ ElementalComponentOptions

`ElementalComponent` class offers a powerful and flexible way to configure your components.
You can customize the behavior of your component by passing an optional `ElementalComponentOptions` configuration object to the `super()` constructor.

| Option         | Type                          | Description                                                                                                                                                                                                                                                                |
| -------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | `ElementalComponentId`        | An optional `id` for the instance of the custom element.<br/> An alphanumeric ID will be auto generated if one is not provided here.                                                                                                                                       |
| noShadow       | `boolean`                     | By default, an `ElementalComponent` is created with a shadowRoot (enclosed in a shadow DOM). However, this configuration property allows us to create an instance without a shadow DOM.                                                                                    |
| mode           | `ShadowRootMode`              | By default, an `ElementalComponent` is created with a shadow DOM in the 'open' mode. However, this configuration property allows us to create one in a 'closed' mode.                                                                                                      |
| delegatesFocus | `boolean`                     | A boolean that, when set to true, specifies behavior that mitigates custom element issues around focusability. When a non-focusable part of the shadow DOM is clicked, the first focusable part is given focus, and the shadow host is given any available :focus styling. |
| eventHandlers  | `EventListenerRegistration[]` | Event Listeners can be auto registered if they are configured here. Read more in the `Decorator` and `Event Controller` section of the guide.                                                                                                                              |

```ts
import { Component, ElementalComponent } from '@sohailalam2/elemental-web';

@Component()
export class Paragraph extends ElementalComponent {
  constructor() {
    super({ mode: 'closed', delegatesFocus: false });
    // optional configurations can be passed in super constructor
  }

  protected render(): void {}
}
```

::: warning 👺 Register Your Component
Use the decorator `@Component()` or call the `ElementalComponent.register(...)` method explicitly to register your component before use.

Read next chapter to learn more.
:::
