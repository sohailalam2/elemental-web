import { Component } from '../../../src';

import { Hero } from './Hero';

@Component()
export class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}
