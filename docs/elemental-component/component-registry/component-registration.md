# Component Registration

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

#### Registering a component and a template together

```ts
const template = `<button>MyButton</button>`;

ElementalComponentRegistry.register(ButtonCounter, { template });
```

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
