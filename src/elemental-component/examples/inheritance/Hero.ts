/* eslint-disable no-magic-numbers */
import { deserialize, randomHex, serialize } from '@sohailalam2/abu';
import { ElementalComponent } from '@/elemental-component';

import styles from './styles.css?inline';
import template from './template.html?raw';

interface HeroMessage {
  name: string;
  message: string;
}

export class Hero extends ElementalComponent<HeroMessage> {
  static get observedAttributes() {
    return ['name', 'tagline', 'state'];
  }

  name = '';

  tagline = '';

  protected connectedCallback() {
    super.connectedCallback();

    this.registerEventListeners([
      {
        name: 'click',
        handler: this.onButtonClickHandler,
        attachTo: this.$root.querySelector('button') as HTMLButtonElement,
      },
      {
        name: 'UpdateText',
        handler: this.onUpdateTextHandler,
        isCustomEvent: true,
      },
    ]);

    setTimeout(() => {
      if (!this.name) {
        this.setAttribute('name', 'Cat Woman🐱');
      }
    }, 2000);
  }

  protected render() {
    const style = this.$root.querySelector('style');
    const name = this.$root.querySelector('.name') as HTMLParagraphElement;
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;
    const secret = this.$root.querySelector('.secret') as HTMLParagraphElement;

    if (style) {
      style.textContent = styles;
    }

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state) {
      secret.textContent = `
        ${this.$state.name} send a secret message.
        ${this.$state.message}
      `;
    }
  }

  protected onButtonClickHandler(e: Event) {
    e.preventDefault();

    this.raiseEvent(
      'UpdateText',
      true,
      serialize({
        name: this.name,
        message: `secret code #${randomHex()}`,
      }),
    );
  }

  protected onUpdateTextHandler(e: Event): void {
    const msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg.name !== this.name) {
      this.updateState(msg);
    }
  }
}

ElementalComponent.register(Hero, { template });
