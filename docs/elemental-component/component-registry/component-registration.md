# Component Registration

The registration capabilities offered by `ElementalComponentRegistry` are also available through `ElementalComponent`.
Therefore, it is not mandatory to use the Registry to register your components and templates. The static method `register()` provided by `ElementalComponent` can also be used to register components directly.

## Register a Component

All custom elements MUST be registered before they can be instantiated, not doing so will result in an
`ElementalComponentIsNotRegisteredException` exception.

::: warning 👺 Register Your Component
Register your components before you use.
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

### RegistrationOptions

| Option     | Type                       | Description                                                                                                                                                                                                     |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prefix     | `ElementalComponentPrefix` | The custom prefix for the element. Defaults to `el-` prefix                                                                                                                                                     |
| templateId | `string`                   | The ID of the template that should be used as a template for this component This option allows us to reuse existing templates                                                                                   |
| template   | `string`                   | The template HTML that should be registered along with the template registration.                                                                                                                               |
| styles     | `string`                   | Styles that will be registered as a style element in the component root                                                                                                                                         |
| extends    | `string`                   | 👺 `deprecated` do NOT use! <br/> <br/> The extension of native HTML components is not supported by Safari. The team has decided to not support it in the future either. So use this functionality with caution |

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
It may come as no surprise that the `register()` method can be used to register any `HTMLElement`, and is not limited to just `ElementalComponent`.
So, don't be shy, go ahead and give it a try, you'll be amazed at how much it can benefit you! :)
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

#### Registering a component with a template and styles

```ts
const template = `<button>MyButton</button>`;
const styles = `:host { padding: 0; margin: 0; }`;

ElementalComponentRegistry.register(ButtonCounter, { template, styles });
```

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
