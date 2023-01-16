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

::: tip 💁 `this.$root`
Every instance of ElementalComponent provides direct access to its DOM root through the read-only instance property `this.$root`.
:::

### Usage

```ts
import { ElementalComponentState, StatefulElementalComponent } from '@sohailalam2/elemental-web';

class MyState extends ElementalComponentState<string> {}

class MyComponent extends StatefulElementalComponent<MyState> {
  constructor() {
    super({ state: MyState.from('Hello World'), mode: 'closed' });
  }

  render() {
    if (!this.$template) {
      this.$root.innerHTML = `<p>${this.$state.value}</p>`;
      return;
    }

    // If a template was registered then do this
    const p = this.$root.querySelector('p');

    if (p) {
      p.textContent = this.$state.value;
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
