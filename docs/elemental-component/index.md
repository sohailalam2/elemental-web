# Elemental Component

> Your regular HTMLElement (aka. Web Component) but on steroid 💪

Empower your web development with advanced custom elements 🚀

## ✅ Features

- **No DSL** (Domain Specific Language) to learn... Use the regular JS & DOM APIs
- Create and manage [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) with ease using `ElementalComponent`
- Streamline **state management** with `StatefulElementalComponent` and [ValueObjects](https://abu.sohailalam.in/data-helpers/value-object/index)
- Flexibility to use the regular DOM or the powerful [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- Create reusable and inheritable [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) for your components
- Supports [Inheritance](./examples/3-inheritance.md) - Inherit and extend functionalities from parent elements with ease
- Manage native and [custom events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) with ease
- **Supports Decorators** to reduce boilerplate code and make life even simpler
- And much more fun 😃

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
