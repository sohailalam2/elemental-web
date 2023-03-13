import { Component } from '../../../src';

import { Hero } from './Hero';

import styles1 from './styles1.css?inline';

@Component({ styles: [styles1] })
export class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}
