import { Component, ElementalComponent } from '../../../../src';

import template from './template.html?raw';

@Component({ template })
export class Paragraph extends ElementalComponent {
  protected render(): void {
    // do nothing as all we want is to render the template
  }
}
