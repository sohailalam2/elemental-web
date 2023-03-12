# Component Registration

## Register your Component

Before you can create an instance of your component, you need to register it first.
Trust us, you don't want to forget this step - if you do, you'll be hit with the dreaded `ElementalComponentIsNotRegisteredException` exception. Nobody wants that.

Luckily, `ElementalComponent` has multiple ways to register your component.
Sure, you could use the native custom element API [customElements.define(...)](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
if you really wanted to, but we don't recommend it. Why? Well, because `ElementalComponent` has better ways to handle
errors, manage prefix alteration, and provide logging for easier debugging. Trust us, your future self will thank you.

Now, you might be wondering - what's the better way to register my component, then? We're glad you asked. Keep reading for a simpler and more elegant solution.

::: tip 💁 Auto generated ID
All components when instantiated will get an auto-generated `id` if one is not provided, but as always you have the power to configure it.
:::

## RegistrationOptions

Before learning how to register your component, take a look at the following configuration table.
These configuration options abstracts away the complexity of using templates and css styles from you.
All elemental way of registration supports these _optional_ configuration properties.

| Option     | Type                       | Description                                                                                                                                                                                                                                                     |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prefix     | `ElementalComponentPrefix` | The custom prefix for the element. Custom element native API mandates a tag name with dash hence if a prefix is not configured, all elements will be prefixed with `el-` prefix.                                                                                |
| templateId | `string`                   | The ID of the template that should be used as a template for this component. This option allows us to reuse existing templates                                                                                                                                  |
| template   | `string`                   | The template HTML code that should be registered with the component.                                                                                                                                                                                            |
| styles     | `string`                   | CSS styles code that will be registered with the component. If the browser supports `adoptedStyleSheets` then we will cache the styles and they will be intelligently used by all component instances without duplication thereby saving precious parsing time. |
| extends    | `string`                   | 👺 `deprecated` DO NOT use! <br/> <br/> The extension of native HTML components is not supported by Safari. The team has decided to not support it in the future either. So use this functionality with caution.                                                |

### Configure a default custom prefix

As noted above, custom element native API mandates a tag name with dash hence if a prefix is not configured,
all `ElementalComponent` components will be prefixed with `el-` prefix. However, this can be overridden globally or per component basis to suit your preferences.

The below code shows how to globally override the prefix to your custom value. Subsequently, any additional components
registered will utilize the newly set default prefix without the need for explicit inclusion during the registration process.

```ts
ElementalComponentRegistry.setDefaultPrefix(
  ElementalComponentPrefix.from('my'), // prefix will now become `my-`
);
```

## Component Registration Process

### Using `@Component()` Decorator

The simplest and straight forward way to register your component is by using the `@Component(options)` class decorator.

#### Usage

```ts
import { Component, ElementalComponent } from '@sohailalam2/elemental-web';

// Here Paragraph gets registered as `el-paragraph`
// and ready for use as <el-paragraph></el-paragraph>

@Component()
export class Paragraph extends ElementalComponent {
  protected render(): void {}
}

// register with additional options

// templates and styles need to be strings it doesnt matter how you get them
// but if you are using Vite, you can simply import them like so
import styles from './styles.css?inline';
import template from './template.html?raw';

@Component({ template, styles })
export class Hero extends ElementalComponent {
  protected render(): void {}
}
```

### Using the JavaScript API

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

## Template Registration Process

::: tip 💁 Auto Generated Template ID
All templates registered here will end up receiving the same id as the component's tag-name
:::

### Usage

#### Registering with default prefix `el`

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `el-button-counter`. You can see that in the beginning
// of the document body as `<template id="el-button-counter">...</template>`
ElementalComponent.register(ButtonCounter, {
  template: `<button>Click Me</button>`,
});
```

#### Registering with custom prefix

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `awesome-button-counter`.
// You can see that in the beginning of the document body as
// `<template id="awesome-button-counter">...</template>`
ElementalComponent.register(ButtonCounter, {
  template: `<button>Click Me</button>`,
  prefix: ElementalComponentPrefix.from('awesome'),
});
```

::: tip 💁 `this.$template`
When a template is registered or detected by ElementalComponent during component instantiation,
it will be cloned and attached to the component's inner DOM.

The template can be accessed through the read-only instance property `$template`.
:::

#### Link a different template

Assume that a template with the id for example, "custom-template" is already present in the DOM, it can be utilized during the
instantiation of an elemental component by passing the `templateId` parameter. The component will then use the specified template at runtime.

If a template is not found registered by that id, an exception `ElementalComponentNoSuchTemplateFoundException` will be thrown.

::: warning It's a reference not a copy
When a `templateId` is supplied, and a corresponding template is found within the DOM,
ElementalComponent will utilize the content of that template directly, as opposed to creating a new copy.

This means, you will not see any new template being registered to the DOM with id as the component's tag-name.
:::

```ts
ElementalComponent.register(ButtonCounter);

const myButton = new ButtonCounter({
  templateId: `some-template-id`,
});
```

The `templateId` can be passed during the registration process to use as the template for the element.
In this scenario, the template will be copied and assigned the id of the element's `tagName`.

```ts
ElementalComponent.register(ButtonCounter, {
  templateId: `some-template-id`,
});
```

#### Example

```ts
import { ElementalComponent } from '@sohailalam2/elemental-web';

import styles from './styles.scss?inline';
import template from './template.html?raw';

export class Magician extends ElementalComponent {
  render(): void {}
}

ElementalComponent.register(Magician, { template, styles });
```

Now that you know how to register your components, take a look at in the next chapter how you can instantiate and use them.
