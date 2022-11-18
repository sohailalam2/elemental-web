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
