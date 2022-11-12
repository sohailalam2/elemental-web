# Elemental Component Registry

The registry implementation that simplifies how we register a custom element or a template.
It also exposes a bunch of other helper methods, all of which are public and static.

::: info Default Prefix
The `ElementalComponentRegistry` uses the text `el` _(stands for elemental)_ as the default prefix
for all purposes.
:::

## Changing the default prefix

By default, ElementalComponent will register components with a prefix `el` however, this can be changed by
using the following method:

```ts
ElementalComponentRegistry.setDefaultPrefix(
  ElementalComponentPrefix.from('my'), // prefix will now become `my-`
);
```

## Register a Component

All custom elements MUST be registered before they can be instantiated, not doing so will result in an
`ElementalComponentIsNotRegisteredException` exception.

::: warning 👺 Register Your Component
Register your components before you use. Register them even if you only declare them in HTML pages.
:::

### Method Signature

```ts
export class ElementalComponentRegistry {
  public static registerComponent(element: Class<HTMLElement>, options?: RegistrationOptions): void {}
}
```

::: tip 💁 Auto generated ID
All custom elements when instantiated will get an auto-generated `id` if one is not provided
:::

### Usage

#### Registering with default prefix `el`

```ts
// Here ButtonCounter gets registered as `el-button-counter`
// and ready for use as <el-button-counter></el-button-counter>
ElementalComponentRegistry.register(ButtonCounter);
```

#### Registering with custom prefix

```ts
// Here ButtonCounter gets registered as `awesome-button-counter`
// and ready for use as <awesome-button-counter></awesome-button-counter>
ElementalComponentRegistry.register(ButtonCounter, {
  prefix: ElementalComponentPrefix.from('awesome'),
});
```

::: tip 💁 Register any `HTMLElement`
Not so surprising is that you can use the `register()` method to register _any_ `HTMLElement` and not necessarily
restricted to using `ElementalComponent` and you will still benefit from its usage :)
:::

## Check if component is registered

`ElementalComponentRegistry` exposes the following helper methods to check whether a component has been registered or
not.

### Method Signatures

```ts
export class ElementalComponentRegistry {
  // This checks the registry's storage and will only return a `true`
  // if the component was registered using the Registry
  public static isComponentRegisteredByClassName(className: string): boolean {}

  // This checks the registry's storage and will only return a `true`
  // if the component was registered using the Registry
  public static isComponentRegistered(element: Class<HTMLElement>): boolean {}

  // This directly checks the Browser's component registry
  // and bypasses the `ElementalComponentRegistry`.
  // A component that may have be registered directly using the
  // `customElements` API and not with `ElementalComponentRegistry`,
  // in such cases this will still return `true`
  public static isComponentRegisteredByTagName(tagName: string): boolean {}
}
```

## Register a Template

There are multiple ways of registering an HTML template for a component:

- You can literally define all templates in your `index.html` file for instance, using the `<template>...</template>`
  tags
- You can also programmatically use `document.createElement()` to create the template
- OR you could use `ElementalComponentRegistry`'s helper method to do the same

::: tip 💁 Auto Generated Template ID
All templates registered using `ElementalComponentRegistry` will end up receiving the same id
as the custom component's tag-name
:::

### Method Signature

```ts
export class ElementalComponentRegistry {
  public static registerTemplate(
    element: Class<HTMLElement>,
    template: string,
    prefix?: ElementalComponentPrefix,
  ): void {}
}
```

### Usage

#### Registering with default prefix `el`

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `el-button-counter`. You can see that in the beginning
// of the document body as `<template id="el-button-counter">...</template>`
ElementalComponentRegistry.registerTemplate(ButtonCounter, `<button>Click Me</button>`);
```

#### Registering with custom prefix

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `awesome-button-counter`.
// You can see that in the beginning of the document body as
// `<template id="awesome-button-counter">...</template>`
ElementalComponentRegistry.registerTemplate(
  ButtonCounter,
  `<button>Click Me</button>`,
  ElementalComponentPrefix.from('awesome'),
);
```

::: tip 💁 Register template for any `HTMLElement`
Not so surprising is that you can use the `registerTemplate()` method to register a template string for
_any_ `HTMLElement` and not necessarily restricted to using `ElementalComponent` and you will still benefit from its
usage :D
:::

## Check if template is registered

`ElementalComponentRegistry` exposes the following helper methods to check whether a component template has been
registered or not.

### Method Signatures

```ts
export class ElementalComponentRegistry {
  // This checks the registry's storage and will only return a `true`
  // if the template was registered using the Registry
  public static isTemplateRegistered(element: Class<HTMLElement>): boolean {}

  // This checks the DOM directly and bypasses the registry
  // A template that may have be declred in the HTML DOM and not have been
  // registered with `ElementalComponentRegistry`, this will still return `true`
  public static isTemplateRegisteredByTagName(tagName: string): boolean {}
}
```
