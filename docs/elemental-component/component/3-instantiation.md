# Component Instantiation

## Instantiate a Component

An `ElementalComponent` once registered is ready for use and can be instantiated in two ways:

- By using it as an HTML tag in a document or
- By programmatically using the `document.createElement(...)` API or
- By programmatically using the `document.body.appendChild(component)` API etc.

### Instantiate in HTML

The below example will instantiate a new `ButtonCounter` elemental component with its initial `state` set to the value `0`.

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

### Instantiate Programmatically in JS

::: tip 💁 `this.$root`
Every instance of ElementalComponent provides direct access to its DOM root through the read-only instance property `this.$root`.
:::

### Usage

```ts
import { Component, ElementalComponent } from '@sohailalam2/elemental-web';

const template = `<p>This is an example paragraph.</p>`;

@Component({ template })
export class Paragraph extends ElementalComponent {
  protected render(): void {}
}

// ...
// Somewhere else in the code...
// ...
document.body.appendChild(new Paragraph());

const anotherParagraph = document.createElement('el-paragraph');

document.body.appendChild(anotherParagraph);

// could also be initialized in an HTML file as
// <el-paragraph></el-paragraph>
```
