# Component Instantiation

## Instantiate a Component

An `ElementalComponent` once registered is ready for use and can be instantiated in two ways:

- By using it as an HTML tag in a document
- By programmatically for instance by using `document.createElement()` API

### Instantiate using its Tag Name

The below example will instantiate a new `ButtonCounter` with its initial `state` set to the value `0`.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app">
      <el-button-counter state="0"></el-button-counter>
    </div>
    <script type="module" src="/src"></script>
  </body>
</html>
```

### Instantiate Programmatically

### Usage

```ts
class MyComponent extends ElementalComponent {
  constructor() {
    super({ state: 'Hello World', mode: 'closed' });
  }

  render(): string {
    if (!this.$template) {
      this.$root.innerHTML = `<p>${this.$state}</p>`;
      return;
    }

    // If a template was registered then do this
    const p = this.$root.querySelector('p');

    if (p) {
      p.textContent = this.$state;
    }
  }
}

ElementalComponent.register(MyComponent);

// ...
// Somewhere else in the code...
// ...

const component = new MyComponent();

document.body.appendChild(component);
```

::: tip 💁 `this.$root`
Every instance of an `ElementalComponent` can have direct access to its DOM root using
the `this.$root` readonly instance property.
:::
