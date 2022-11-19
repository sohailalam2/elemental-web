# Template Registration

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
  public static registerTemplate(element: Class<HTMLElement>, options?: RegistrationOptions): void {}
}
```

### Usage

#### Registering with default prefix `el`

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `el-button-counter`. You can see that in the beginning
// of the document body as `<template id="el-button-counter">...</template>`
ElementalComponentRegistry.registerTemplate(ButtonCounter, {
  template: `<button>Click Me</button>`,
});
```

#### Registering with custom prefix

```ts
// Here the given template string gets registered as a `ButtonCounter`
// template with an id `awesome-button-counter`.
// You can see that in the beginning of the document body as
// `<template id="awesome-button-counter">...</template>`
ElementalComponentRegistry.registerTemplate(ButtonCounter, {
  template: `<button>Click Me</button>`,
  prefix: ElementalComponentPrefix.from('awesome'),
});
```

::: tip 💁 Register template for any `HTMLElement`
Not so surprising is that you can use the `registerTemplate()` method to register a template string for
_any_ `HTMLElement` and not necessarily restricted to using `ElementalComponent` and you will still benefit from its
usage :D
:::

#### Copying an existing template while registering a component

Let's say we already have a template registered in the DOM with an id of `custom-template`.
If we choose to create an element that uses this existing template instead,
then we can simply pass the `templateId` during the registration of
the component and its content will be copied into a new template.

If no such template is found, an `ElementalComponentNoSuchTemplateFoundException` will be thrown.

```ts
ElementalComponentRegistry.register(ButtonCounter, { templateId: `some-template-id` });
```

::: warning It's a copy not a reference
If a `templateId` is provided and a template with such an id already exists, then the
registry will try to copy its content into a new template element which will then be
registered for the given component.
:::

#### Registering a component with a template and styles

```ts
const template = `<button>MyButton</button>`;
const styles = `:host { padding: 0; margin: 0; }`;

ElementalComponentRegistry.registerTemplate(ButtonCounter, { template, styles });
```

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
