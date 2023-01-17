import { ElementalComponent } from '../../../../src';

import template from './template.html?raw';

export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do nothing as all we want is to render the template
  }
}

ElementalComponent.register(Paragraph, { template });
