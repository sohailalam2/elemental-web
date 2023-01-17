# Component Registration

## Register a Component

All custom elements MUST be registered before they can be instantiated, not doing so will result in an
`ElementalComponentIsNotRegisteredException` exception.

::: warning 👺 Register Your Component
Register your components before you use. Register them even if you only declare them in HTML pages.
:::

> Read more about [component registration here](/elemental-component/component-registry/component-registration.md).

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

The default prefix for ElementalComponent is `el`. This can be customized to suit your preferences as shown below.
Subsequently, any additional components registered will utilize the newly set default prefix without the need for
explicit inclusion during the registration process.

```ts
ElementalComponentRegistry.setDefaultPrefix(ElementalComponentPrefix.from('my'));
```

## Template Registration

> Read more about [template registration here](/elemental-component/component-registry/template-registration.md).

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
it can be accessed through the read-only instance property `$template`.
:::

#### Link a different template

If a template with the id for example, "custom-template" is already present in the DOM, it can be utilized during the
instantiation of an elemental component by passing the `templateId` parameter. The component will then use the specified template at runtime.

If a template is not found registered by that id, an exception `ElementalComponentNoSuchTemplateFoundException` will be thrown.

::: warning It's a reference not a copy
When a `templateId` is supplied, and a corresponding template is found within the DOM,
ElementalComponent will utilize the content of that template directly, as opposed to creating a new copy.
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
