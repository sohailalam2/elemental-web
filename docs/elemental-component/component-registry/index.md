# Elemental Component Registry

The ElementalComponentRegistry simplifies the process of registering a custom element or a template, and offers a variety
of other helpful public and static methods.

::: info Default Prefix
The `ElementalComponentRegistry` uses the text `el` _(stands for elemental)_ as the default prefix
for all purposes.
:::

## Changing the default prefix

The default prefix for ElementalComponent is "el," however, it can be customized by using the provided method:

```ts
ElementalComponentRegistry.setDefaultPrefix(
  ElementalComponentPrefix.from('my'), // prefix will now become `my-`
);
```
