# Component Attributes

## Attributes and Properties

When a new attribute is added to the component, `ElementalComponent` automatically exposes it as a class property.

If the attribute is designated as observable by either overriding the `observedAttributes` static getter,
or by using the `@ObservedState` decorator, the attribute and property will remain in sync with any data updates.

## Observing a Property

::: danger 👺 Choose only one approach
Either use `@ObservedState` or override the `static get observedAttributes()`. Do not mix and match.
:::

### By using `@ObservedState` decorator

```ts
@Component
class Hero extends ElementalComponent {
  @ObservedState
  private superpower = 'unknown';

  // rest of the code ommitted for brevity...
}
```

### By Overriding the static `observedAttributes` getter

```ts
@Component
class Hero extends ElementalComponent {
  static get observedAttributes() {
    return ['superpower'];
  }

  private superpower = 'unknown';

  // rest of the code ommitted for brevity...
}
```

## Updating an Observed Property

`ElementalComponent` overrides the `attributeChangedCallback(...)` lifecycle hook to listen to property changes
and these changes are triggered only when the attribute value is updated via the native `setAttribute(...)` API.

Hence, the correct way to update an observed property is to call the `this.setAttribute('property-name', 'property-value');` API.

## Example

In the following example, note that there are three attributes used in the HTML code.
`id`, `name`, and `superpower`. Only `superpower` attribute is made an observable.

When the `superpower` attribute change is detected, the corresponding class property `this.superpower`
also gets updated.

```html
<!-- somewhere in index.html -->

<el-hero id="one" name="Superman" superpower="Laser Eyes"></el-hero>
```

```ts
import { Component, ElementalComponent, ObservedState } from '@sohailalam2/elemental-web';

@Component
class Hero extends ElementalComponent {
  private name = 'unknown';

  @ObservedState
  private superpower = 'unknown';

  protected render() {
    this.$root.innerHTML = `
        <p>I am ${this.name} and I have ${this.superpower}</p>
    `;
  }

  protected connectedCallback() {
    super.connectedCallback();

    // simulating an update after 2 seconds
    setTimeout(() => {
      // ✅ Correct way, will auto update the DOM
      this.setAttribute('superpower', 'XRay Vision');

      // ❌ Wrong way... this will not update the DOM
      this.superpower = 'Super Hearing';
    }, 2000);
  }
}
```
