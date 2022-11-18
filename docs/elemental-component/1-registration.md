# Component Registration

## Register a Component

All custom elements MUST be registered before they can be instantiated, not doing so will result in an
`ElementalComponentIsNotRegisteredException` exception.

::: warning 👺 Register Your Component
Register your components before you use. Register them even if you only declare them in HTML pages.
:::

> Read more about [component registration here](./component-registry/component-registration.md).

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

> Read more about [template registration here](./component-registry/template-registration.md).

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
// template with an id `awesome-button-counter`.
// You can see that in the beginning of the document body as
// `<template id="awesome-button-counter">...</template>`
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

const myButton = new ButtonCounter({ templateId: `some-template-id` });
```
