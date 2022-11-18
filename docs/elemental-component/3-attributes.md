# Component Attributes

## Attributes and Properties

When a new attribute is added to the component, ElementalComponent automatically exposes the attribute
as a class property and if that attribute is made observable, then the attribute and property will
be kept in sync.

### Example

In the following example, note that there are three attributes used in the HTML code.
`id`, `name`, and `superpower`. Only `superpower` attribute is made an observable.

When the `superpower` attribute change is detected, the corresponding class property `this.superpower`
also gets updated.

```html
<!-- somewhere in index.html -->

<el-hero id="one" name="Superman" superpower="Laser Eyes"></el-hero>
```

```ts
class Hero extends ElementalComponent {
  // IMPORTANT!
  // This is the way to make attributes observable
  static get observedAttributes() {
    return ['superpower'];
  }

  private name = 'Unknown';

  private superpower = 'Unknown';

  protected render() {
    this.$root.innerHTML = `
        <p>I am ${this.name} and I have ${this.superpower}</p>
    `;
  }

  protected connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      // IMPORTANT!
      // The only way how an attribute change is fired,
      // is when we call the setAttribute method
      this.setAttribute('superpower', 'XRay Vision');

      // NWRONG WAY!!
      // This will NOT fire a change event hence the DOM will
      // not be refreshed and the attribute will not be in
      // sync with the property value
      this.superpower = 'Super Hearing';
    }, 2000);
  }
}
```
