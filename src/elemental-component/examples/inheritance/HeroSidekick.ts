import { ElementalComponent } from '@/elemental-component';

import { Hero } from './Hero';

export class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}

ElementalComponent.register(HeroSidekick);
