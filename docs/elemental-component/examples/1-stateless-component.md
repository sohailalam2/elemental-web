# Stateless Component Example

![stateless-component-example.png](/assets/elemental-component/stateless-component-example.png)

## template.html

```html
<p>This is a regular paragraph, defined as a stateless elemental-component.</p>
```

## Paragraph.ts

```ts
import { ElementalComponent } from '@sohailalam2/elemental-web';

import template from './template.html?raw';

export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do nothing as all we want is to render the template
  }
}

ElementalComponent.register(Paragraph, { template });

// Create a new Paragraph element
document.body.appendChild(new Paragraph());
```
