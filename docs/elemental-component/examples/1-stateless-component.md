# Stateless Component Example

![stateless-component-example.png](/assets/elemental-component/stateless-component-example.png)

## Code

### template.html

```html
<p>This is a regular paragraph, defined as a stateless elemental-component.</p>
```

### Paragraph.ts

```ts
import { Component, ElementalComponent } from '@sohailalam2/elemental-web';

import template from './template.html?raw';

@Component({ template })
export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do nothing as all we want is to render the template
  }
}

// ----------------------
// somewhere else in code
// ----------------------
document.body.appendChild(new Paragraph());
```
